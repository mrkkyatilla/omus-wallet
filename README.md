# omus-wallet Kripto Cüzdan Uygulaması

Bu proje, Ethereum ve Solana ağları ile etkileşim kurabilen bir mobil kripto cüzdan uygulamasıdır. React Native (Expo) kullanılarak geliştirilmiştir.

## Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/mrkkyatilla/omus-wallet.git
    cd omus-wallet
    ```

2.  **Gerekli Paketleri Yükleyin:**
    ```bash
    npm install
    ```

3.  **Ortam Değişkenlerini Ayarlayın (ÇOK ÖNEMLİ):**
    Projenin düzgün çalışabilmesi için Ethereum (Infura) ve Solana (RPC) bağlantılarına ihtiyacı vardır.
    - Proje kök dizininde `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun.
    - Oluşturduğunuz `.env` dosyasını açın ve kendi API anahtarlarınızı girin:

    ```
    EXPO_PUBLIC_INFURA_ID="YOUR_INFURA_ID_HERE"
    EXPO_PUBLIC_SOLANA_RPC="YOUR_SOLANA_RPC_URL_HERE"
    ```

4.  **Uygulamayı Başlatın:**
    Uygulamayı başlatmak ve test için bir tünel oluşturmak üzere aşağıdaki komutu çalıştırın:
    ```bash
    npm run tunnel
    ```
    Terminalde görünecek olan QR kodu iOS veya Android telefonunuzdaki Expo Go uygulaması ile okutarak uygulamayı canlı olarak test edebilirsiniz.

## Olası Sorunlar

-   **Ortam Değişkenleri Eksikliği:** Eğer `.env` dosyasını oluşturmaz veya içindeki değişkenleri ayarlamazsanız, uygulama halka açık ve limitli RPC endpoint'lerini kullanacaktır. Bu durum, uygulamanın performansını ve güvenilirliğini olumsuz etkileyebilir. Konsolda bu konuyla ilgili uyarılar görebilirsiniz.
-   **Paket Uyuşmazlıkları:** `npm install` sonrası hata alırsanız, `node_modules` klasörünü ve `package-lock.json` dosyasını silip `npm install` komutunu tekrar çalıştırmayı deneyin.