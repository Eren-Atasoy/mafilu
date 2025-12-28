# Stripe Price ID'leri Oluşturma

## Hızlı Adımlar

### 1. Stripe Dashboard'da Products Sayfasına Git

**Yöntem 1:** Sol sidebar'da **"Product catalog"** (kutu ikonu 📦) seçeneğine tıklayın.

**Yöntem 2:** Doğrudan bu linke gidin:
👉 https://dashboard.stripe.com/test/products

**Not:** Şu anda "Subscriptions" sayfasındaysanız, sol sidebar'dan "Product catalog"a geçmeniz gerekiyor.

### 2. Her Plan İçin Product ve Price Oluştur

#### Basic Plan (49.99 TRY/ay)
1. "Add product" butonuna tıklayın
2. **Name**: `Basic Plan`
3. **Description**: `Bağımsız sinema tutkunları için`
4. **Pricing**: 
   - **Price**: `49.99`
   - **Currency**: `TRY` (Turkish Lira)
   - **Billing period**: `Monthly` (recurring)
5. "Save product" butonuna tıklayın
6. **Price ID**'yi kopyalayın (örn: `price_1ABC...`)

#### Premium Plan (99.99 TRY/ay)
1. "Add product" butonuna tıklayın
2. **Name**: `Premium Plan`
3. **Description**: `Tam deneyim`
4. **Pricing**:
   - **Price**: `99.99`
   - **Currency**: `TRY`
   - **Billing period**: `Monthly` (recurring)
5. "Save product" butonuna tıklayın
6. **Price ID**'yi kopyalayın

#### Producer Pro Plan (199.99 TRY/ay)
1. "Add product" butonuna tıklayın
2. **Name**: `Producer Pro Plan`
3. **Description**: `Filmlerinizi yayınlayın`
4. **Pricing**:
   - **Price**: `199.99`
   - **Currency**: `TRY`
   - **Billing period**: `Monthly` (recurring)
5. "Save product" butonuna tıklayın
6. **Price ID**'yi kopyalayın

### 3. Price ID'lerini .env.local'e Ekleyin

Price ID'lerini aldıktan sonra, `.env.local` dosyasına şu şekilde ekleyin:

```env
STRIPE_BASIC_PRICE_ID=price_1ABC... (gerçek price ID)
STRIPE_PREMIUM_PRICE_ID=price_1XYZ... (gerçek price ID)
STRIPE_PRODUCER_PRICE_ID=price_1DEF... (gerçek price ID)
```

### 4. Alternatif: Test İçin Geçici Çözüm

Eğer şimdilik test etmek istiyorsanız, subscription plan'larını geçici olarak devre dışı bırakabiliriz veya free plan kullanabilirsiniz.

## Price ID Formatı

Stripe price ID'leri şu formatta olur:
- `price_` ile başlar
- Yaklaşık 30-40 karakter uzunluğunda
- Örnek: `price_1O8kKjLJSpf2txZSis3jzf6k`

## Sorun Giderme

### "No such price" Hatası
- Price ID'nin doğru kopyalandığından emin olun (boşluk olmamalı)
- Test mode'da olduğunuzdan emin olun (price ID `price_` ile başlamalı, `price_live_` değil)
- Product'ın "Active" durumunda olduğundan emin olun

