# Dünya Vatandaşlığı NFT - Blockchain Entegrasyonu

## 🚀 Gerçek Blockchain Entegrasyonu

Bu proje Stacks blockchain üzerinde çalışan gerçek bir NFT ve DAO sistemidir.

### 📋 Gereksinimler

- **Clarinet 3.5.0+** - Stacks geliştirme aracı
- **Node.js 18+** - Frontend için
- **Hiro Wallet veya Xverse** - Kullanıcı cüzdanları

### 🔧 Kurulum

1. **Clarinet Kurulumu:**
   ```bash
   # Windows için MSI installer
   # https://docs.hiro.so/clarinet/how-to-guides/how-to-install-clarinet
   ```

2. **Proje Bağımlılıkları:**
   ```bash
   npm install
   ```

3. **Devnet Başlatma:**
   ```bash
   clarinet devnet start --no-dashboard
   ```

4. **Frontend Başlatma:**
   ```bash
   npm run dev
   ```

### 🏗️ Mimari

#### Smart Contracts (Clarity)

1. **world-citizenship-nft.clar**
   - NFT mint işlemleri
   - Vatandaşlık durumu kontrolü
   - Metadata yönetimi

2. **world-citizenship-dao.clar**
   - Teklif oluşturma
   - Oylama sistemi
   - DAO parametreleri

#### Frontend (Next.js + TypeScript)

1. **Ana Sayfa (`app/page.tsx`)**
   - Cüzdan bağlantısı
   - NFT mint işlemleri
   - Vatandaşlık durumu gösterimi

2. **DAO Sayfası (`app/dao/page.tsx`)**
   - Teklif listesi
   - Oylama sistemi
   - Filtreleme ve sıralama

3. **Stacks Entegrasyonu (`lib/stacks.ts`)**
   - Blockchain işlemleri
   - Contract call parametreleri
   - Read-only fonksiyonlar

### 🔗 Blockchain İşlemleri

#### NFT Mint İşlemi

```typescript
// 1. Contract call parametreleri hazırla
const contractCallParams = prepareMintContractCall(
  userAddress,
  name,
  description,
  imageUri
)

// 2. Transaction oluştur
const transaction = await makeContractCall(contractCallParams)

// 3. Cüzdan ile imzala
const result = await provider.request({
  method: 'stx_signTransaction',
  params: {
    transaction: transaction.serialize().toString('hex')
  }
})
```

#### DAO Teklif Oluşturma

```typescript
// 1. Teklif parametreleri
const proposalParams = prepareCreateProposalContractCall(
  userAddress,
  title,
  description,
  proposalType,
  options,
  duration,
  fee
)

// 2. Blockchain'e gönder
const transaction = await makeContractCall(proposalParams)
```

#### Oylama İşlemi

```typescript
// 1. Oy parametreleri
const voteParams = prepareVoteContractCall(
  userAddress,
  proposalId,
  choice
)

// 2. Oy gönder
const transaction = await makeContractCall(voteParams)
```

### 🌐 Ağ Konfigürasyonu

#### Devnet (Geliştirme)
- **URL:** http://localhost:20443
- **API:** http://localhost:3999
- **Explorer:** http://localhost:8000

#### Testnet (Test)
- **URL:** https://api.testnet.hiro.so
- **Explorer:** https://explorer.hiro.so

#### Mainnet (Üretim)
- **URL:** https://api.hiro.so
- **Explorer:** https://explorer.hiro.so

### 🔐 Güvenlik

1. **Cüzdan Bağlantısı**
   - Hiro Wallet veya Xverse kullanımı
   - Kullanıcı onayı gerektiren işlemler
   - Transaction imzalama

2. **Hata Yönetimi**
   - Kullanıcı dostu hata mesajları
   - Network bağlantı kontrolü
   - Transaction durumu takibi

3. **Veri Doğrulama**
   - Form validasyonu
   - Contract parametre kontrolü
   - Gas fee hesaplaması

### 📊 Monitoring

#### Transaction Takibi
- Explorer linkleri
- Transaction hash'leri
- Block confirmation sayısı

#### DAO İstatistikleri
- Aktif teklif sayısı
- Katılım oranları
- Oy dağılımları

### 🚀 Deployment

#### Devnet'e Deploy
```bash
clarinet devnet start
clarinet devnet deploy
```

#### Testnet'e Deploy
```bash
clarinet deployments apply --testnet
```

#### Mainnet'e Deploy
```bash
clarinet deployments apply --mainnet
```

### 🔧 Troubleshooting

#### Yaygın Sorunlar

1. **Clarinet Bağlantı Hatası**
   ```bash
   # Devnet'i yeniden başlat
   clarinet devnet stop
   clarinet devnet start
   ```

2. **Cüzdan Bağlantı Sorunu**
   - Cüzdanın açık olduğundan emin ol
   - Network ayarlarını kontrol et
   - Browser extension'ı yeniden yükle

3. **Transaction Hatası**
   - STX bakiyesini kontrol et
   - Gas fee ayarlarını kontrol et
   - Network bağlantısını kontrol et

### 📈 Gelecek Geliştirmeler

1. **Gelişmiş DAO Özellikleri**
   - Delegasyon sistemi
   - Quadratic voting
   - Proposal templates

2. **NFT Geliştirmeleri**
   - Metadata güncelleme
   - Transfer işlemleri
   - Batch minting

3. **Analytics Dashboard**
   - Real-time istatistikler
   - Voting patterns
   - User engagement

### 📞 Destek

- **Dokümantasyon:** https://docs.hiro.so
- **GitHub:** https://github.com/hirosystems
- **Discord:** https://discord.gg/hiro

---

**Not:** Bu proje eğitim amaçlıdır. Üretim ortamında kullanmadan önce güvenlik audit'i yapılması önerilir.
