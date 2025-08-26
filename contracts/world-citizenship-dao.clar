;; World Citizenship DAO Contract
;; Voting system for NFT holders

(define-constant CONTRACT-OWNER tx-sender)
(define-constant NFT-CONTRACT "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.world-citizenship-nft")

;; Proposal structure
(define-data-var proposal-counter uint u0)

(define-data-var proposals (map uint (tuple 
  (creator principal)
  (title (string-ascii 100))
  (description (string-utf8 500))
  (proposal-type (string-ascii 20)) ;; "yes-no", "multiple-choice", "numeric"
  (options (list (string-ascii 50))) ;; Options
  (start-block uint)
  (end-block uint)
  (fee uint) ;; Proposal creation fee
  (active bool)
  (executed bool)
)) (map))

;; Vote structure
(define-data-var votes (map uint (map principal (string-ascii 50))) (map))

;; DAO parameters
(define-data-var dao-params (tuple
  (default-duration uint) ;; Default voting duration (blocks)
  (min-proposal-fee uint) ;; Minimum proposal fee
  (quorum-percentage uint) ;; Quorum percentage (0-100)
) (tuple u259200 u1000000 u20)) ;; 3 days, 1 STX, 20%

;; Events
(define-event proposal-created (proposal-id uint) (creator principal) (title (string-ascii 100)))
(define-event vote-cast (proposal-id uint) (voter principal) (choice (string-ascii 50)))
(define-event proposal-executed (proposal-id uint) (result (string-ascii 50)))

;; NFT holder check
(define-private (is-citizen (user principal))
  (contract-call? .world-citizenship-nft get-owner u0)
)

;; Update DAO parameters (owner only)
(define-public (update-dao-params (new-duration uint) (new-fee uint) (new-quorum uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) (err u1))
    (asserts! (<= new-quorum u100) (err u2))
    (data-set dao-params (tuple new-duration new-fee new-quorum))
    (ok true)
  )
)

;; Create proposal
(define-public (create-proposal 
  (title (string-ascii 100))
  (description (string-utf8 500))
  (proposal-type (string-ascii 20))
  (options (list (string-ascii 50)))
  (duration uint)
  (fee uint)
)
  (let (
    (current-block (block-height))
    (proposal-id (data-var-get proposal-counter))
    (params (data-var-get dao-params))
    (default-duration (get default-duration params))
    (min-fee (get min-proposal-fee params))
  )
    (begin
      ;; NFT holder check
      (asserts! (is-citizen tx-sender) (err u3))
      
      ;; Fee check
      (asserts! (>= fee min-fee) (err u4))
      
      ;; Duration check (minimum 1 day, maximum 30 days)
      (asserts! (and (>= duration u86400) (<= duration u2592000)) (err u5))
      
      ;; Options check
      (asserts! (or 
        (and (is-eq proposal-type "yes-no") (is-eq (len options) u2))
        (and (is-eq proposal-type "multiple-choice") (>= (len options) u2))
        (and (is-eq proposal-type "numeric") (>= (len options) u2))
      ) (err u6))
      
      ;; Transfer fee
      (try! (stx-transfer? fee tx-sender CONTRACT-OWNER))
      
      ;; Create proposal
      (data-set proposals (map-set (data-var-get proposals) proposal-id (tuple
        tx-sender
        title
        description
        proposal-type
        options
        current-block
        (+ current-block duration)
        fee
        true
        false
      )))
      
      ;; Increment counter
      (data-set proposal-counter (+ proposal-id u1))
      
      ;; Emit event
      (emit proposal-created proposal-id tx-sender title)
      
      (ok proposal-id)
    )
  )
)

;; Cast vote
(define-public (vote (proposal-id uint) (choice (string-ascii 50)))
  (let (
    (proposal (unwrap! (map-get? (data-var-get proposals) proposal-id) (err u7)))
    (current-block (block-height))
    (end-block (get end-block proposal))
    (active (get active proposal))
    (options (get options proposal))
  )
    (begin
      ;; NFT holder check
      (asserts! (is-citizen tx-sender) (err u8))
      
      ;; Is proposal active?
      (asserts! active (err u9))
      
      ;; Has voting period expired?
      (asserts! (< current-block end-block) (err u10))
      
      ;; Has already voted?
      (asserts! (is-none (map-get? (unwrap! (map-get? (data-var-get votes) proposal-id) (map))) tx-sender)) (err u11))
      
      ;; Is option valid?
      (asserts! (list-contains? options choice) (err u12))
      
      ;; Save vote
      (let ((proposal-votes (unwrap! (map-get? (data-var-get votes) proposal-id) (map))))
        (data-set votes (map-set (data-var-get votes) proposal-id 
          (map-set proposal-votes tx-sender choice)
        ))
      )
      
      ;; Emit event
      (emit vote-cast proposal-id tx-sender choice)
      
      (ok true)
    )
  )
)

;; Calculate and execute voting result
(define-public (execute-proposal (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? (data-var-get proposals) proposal-id) (err u13)))
    (current-block (block-height))
    (end-block (get end-block proposal))
    (active (get active proposal))
    (executed (get executed proposal))
    (proposal-votes (unwrap! (map-get? (data-var-get votes) proposal-id) (map)))
    (params (data-var-get dao-params))
    (quorum-percentage (get quorum-percentage params))
  )
    (begin
      ;; Is proposal active?
      (asserts! active (err u14))
      
      ;; Has already been executed?
      (asserts! (not executed) (err u15))
      
      ;; Has voting period expired?
      (asserts! (>= current-block end-block) (err u16))
      
      ;; Quorum check
      (let ((total-votes (map-size proposal-votes))
            (total-citizens u1000)) ;; Total NFT count (should be fetched from contract in reality)
        (asserts! (>= (* total-votes u100) (* total-citizens quorum-percentage)) (err u17))
      )
      
      ;; Calculate result
      (let ((result (calculate-result proposal-id proposal-votes)))
        ;; Deactivate proposal
        (data-set proposals (map-set (data-var-get proposals) proposal-id 
          (map-set proposal (get executed proposal) true)
        ))
        
        ;; Emit event
        (emit proposal-executed proposal-id result)
        
        (ok result)
      )
    )
  )
)

;; Result calculation (simple majority)
(define-private (calculate-result (proposal-id uint) (votes (map principal (string-ascii 50))))
  (let ((vote-counts (map)))
    (fold vote-counts votes (lambda (acc (key principal) (value (string-ascii 50)))
      (let ((current-count (unwrap! (map-get? acc value) u0)))
        (map-set acc value (+ current-count u1))
      )
    ))
    ;; Return the option with the most votes
    (get-winning-option vote-counts)
  )
)

;; Find the option with the most votes
(define-private (get-winning-option (vote-counts (map (string-ascii 50) uint)))
  (fold "abstain" vote-counts (lambda (winner (option (string-ascii 50)) (count uint))
    (let ((winner-count (unwrap! (map-get? vote-counts winner) u0)))
      (if (> count winner-count) option winner)
    )
  ))
)

;; Get proposal information
(define-read-only (get-proposal (proposal-id uint))
  (map-get? (data-var-get proposals) proposal-id)
)

;; Get vote information
(define-read-only (get-votes (proposal-id uint))
  (map-get? (data-var-get votes) proposal-id)
)

;; Get DAO parameters
(define-read-only (get-dao-params)
  (data-var-get dao-params)
)

;; Get total proposal count
(define-read-only (get-proposal-count)
  (data-var-get proposal-counter)
)
