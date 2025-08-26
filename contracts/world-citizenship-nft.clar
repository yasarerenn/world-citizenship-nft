;; World Citizenship NFT - Universal Passport
;; 
;; This contract allows every person to obtain a unique "World Citizen NFT" 
;; on the Stacks blockchain. This NFT serves as a universal identity and 
;; offers belonging beyond national borders.

(define-constant CONTRACT_OWNER tx-sender)
(define-constant CONTRACT_NAME "world-citizenship-nft")
(define-constant CONTRACT_SYMBOL "WCIT")

;; NFT metadata structure
(define-data-var total-supply uint u0)
(define-data-var base-uri (string-ascii 256) "")

;; Control to ensure each user can only get one NFT
(define-map user-has-nft principal bool)

;; NFT ownership mapping
(define-map token-owner uint principal)

;; NFT metadata mapping
(define-map token-metadata uint (tuple 
  (name (string-ascii 256))
  (description (string-utf8 1024))
  (image-uri (string-ascii 256))
  (attributes (list 10 (tuple (key (string-ascii 50)) (value (string-ascii 100))))
  (citizenship-date uint)
  (citizen-id (string-ascii 50))
))

;; Events
(define-event WorldCitizenshipMinted 
  (token-id uint)
  (owner principal)
  (citizen-id (string-ascii 50))
)

(define-event CitizenshipTransferred
  (token-id uint)
  (from principal)
  (to principal)
)

;; Error messages
(define-constant ERR-ALREADY-CITIZEN u1001)
(define-constant ERR-NOT-OWNER u1002)
(define-constant ERR-INVALID-TOKEN u1003)
(define-constant ERR-NOT-AUTHORIZED u1004)

;; World citizenship NFT minting function
;; Each user can only call this once
(define-public (mint-citizenship (name (string-ascii 256)) (description (string-utf8 1024)) (image-uri (string-ascii 256)))
  (let ((caller tx-sender))
    ;; Check if user already has an NFT
    (asserts! (not (map-get? user-has-nft caller)) (err ERR-ALREADY-CITIZEN))
    
    ;; Create new token ID
    (let ((new-token-id (+ (var-get total-supply) u1))
          (citizen-id (format! "WCIT-{}" new-token-id))
          (current-block-height block-height))
      
      ;; Give NFT to user
      (map-set token-owner new-token-id caller)
      (map-set user-has-nft caller true)
      
      ;; Save metadata
      (map-set token-metadata new-token-id (tuple
        (name name)
        (description description)
        (image-uri image-uri)
        (attributes (list
          (tuple (key "Citizenship Type") (value "World Citizen"))
          (tuple (key "Universal Rights") (value "Voting, Participation, Identity"))
          (tuple (key "Blockchain") (value "Stacks"))
          (tuple (key "Status") (value "Active"))
        ))
        (citizenship-date current-block-height)
        (citizen-id citizen-id)
      ))
      
      ;; Update total supply
      (var-set total-supply new-token-id)
      
      ;; Emit event
      (ok (print (WorldCitizenshipMinted new-token-id caller citizen-id)))
    )
  )
)

;; Check NFT ownership
(define-read-only (get-owner (token-id uint))
  (map-get? token-owner token-id)
)

;; Get NFT metadata
(define-read-only (get-token-metadata (token-id uint))
  (map-get? token-metadata token-id)
)

;; Check if user has NFT
(define-read-only (has-citizenship (user principal))
  (map-get? user-has-nft user)
)

;; Get total supply
(define-read-only (get-total-supply)
  (var-get total-supply)
)

;; Get user's NFT ID
(define-read-only (get-user-token-id (user principal))
  (fold token-owner (some u0) (lambda (acc (token-id uint) owner) 
    (if (is-eq owner user) (some token-id) acc)
  ))
)

;; NFT transfer function (only owner can transfer)
(define-public (transfer-citizenship (token-id uint) (new-owner principal))
  (let ((caller tx-sender))
    ;; Check that token exists and caller is the owner
    (asserts! (is-some (map-get? token-owner token-id)) (err ERR-INVALID-TOKEN))
    (asserts! (is-eq (unwrap! (map-get? token-owner token-id) (err ERR-INVALID-TOKEN)) caller) (err ERR-NOT-OWNER))
    
    ;; Perform transfer
    (map-set token-owner token-id new-owner)
    (map-set user-has-nft caller false)
    (map-set user-has-nft new-owner true)
    
    ;; Emit event
    (ok (print (CitizenshipTransferred token-id caller new-owner)))
  )
)

;; Universal DAO voting rights check
(define-read-only (can-vote-in-dao (user principal))
  (map-get? user-has-nft user)
)

;; Universal identity verification
(define-read-only (verify-world-citizen (user principal))
  (map-get? user-has-nft user)
)

;; Update base URI by contract owner
(define-public (set-base-uri (new-uri (string-ascii 256)))
  (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR-NOT-AUTHORIZED))
  (ok (var-set base-uri new-uri))
)

;; Update metadata by contract owner
(define-public (update-token-metadata (token-id uint) (new-metadata (tuple 
  (name (string-ascii 256))
  (description (string-utf8 1024))
  (image-uri (string-ascii 256))
  (attributes (list 10 (tuple (key (string-ascii 50)) (value (string-ascii 100))))
  (citizenship-date uint)
  (citizen-id (string-ascii 50))
)))
  (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR-NOT-AUTHORIZED))
  (asserts! (is-some (map-get? token-owner token-id)) (err ERR-INVALID-TOKEN))
  (ok (map-set token-metadata token-id new-metadata))
)
