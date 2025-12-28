# Supabase MCP Kurulum Rehberi

## MCP (Model Context Protocol) Nedir?

MCP, AI asistanlarının Supabase veritabanınıza doğrudan bağlanmasını ve sorgular çalıştırmasını sağlar. Bu sayede:
- Veritabanı şemasını görebilir
- SQL sorguları çalıştırabilir
- Migration'ları uygulayabilir
- Tabloları listeleyebilir
- Log'ları görüntüleyebilir

## Gereksinimler

Supabase MCP'nin çalışması için:

1. **Supabase Project URL** - Projenizin URL'i
2. **Supabase Access Token** - Personal Access Token veya Service Role Key

## Kurulum Adımları

### 1. Supabase Access Token Oluştur

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. **Settings** → **API** sekmesine gidin
4. **Service Role Key** veya **Personal Access Token** oluşturun

**Not:** Service Role Key tüm yetkilere sahiptir, dikkatli kullanın!

### 2. Cursor MCP Yapılandırması

Cursor'da MCP yapılandırması genellikle şu dosyada yapılır:
- `~/.cursor/mcp.json` (macOS/Linux)
- `%APPDATA%\Cursor\mcp.json` (Windows)

Örnek yapılandırma:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_ACCESS_TOKEN": "your-service-role-key-or-access-token"
      }
    }
  }
}
```

### 3. Environment Variables

Alternatif olarak, environment variable'ları kullanabilirsiniz:

```bash
# .env.local veya sistem environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ACCESS_TOKEN="your-service-role-key"
```

### 4. MCP Server'ı Test Et

Cursor'ı yeniden başlattıktan sonra, MCP'nin çalışıp çalışmadığını test edin:

- AI asistanına "Supabase tablolarını listele" diyebilirsiniz
- Veya "profiles tablosundaki kullanıcıları göster" diyebilirsiniz

## Mevcut Proje Bilgileri

Projenizde şu Supabase environment variable'ları kullanılıyor:

- `NEXT_PUBLIC_SUPABASE_URL` - Public URL (anon key ile kullanılır)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key (client-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side, admin yetkileri)

**MCP için:** `SUPABASE_ACCESS_TOKEN` olarak `SUPABASE_SERVICE_ROLE_KEY` kullanabilirsiniz.

## Güvenlik Notları

⚠️ **Önemli:**
- Service Role Key tüm RLS (Row Level Security) politikalarını bypass eder
- Sadece güvendiğiniz ortamlarda kullanın
- Production'da dikkatli kullanın
- Personal Access Token kullanmak daha güvenli olabilir

## Sorun Giderme

### MCP çalışmıyor

1. **Cursor'ı yeniden başlatın**
2. **MCP yapılandırmasını kontrol edin**
3. **Environment variable'ları kontrol edin**
4. **Supabase URL ve token'ın doğru olduğundan emin olun**

### "Not connected" hatası

- MCP server'ın yüklü olduğundan emin olun
- Network bağlantısını kontrol edin
- Supabase project'inizin aktif olduğundan emin olun

## Kullanım Örnekleri

MCP aktif olduktan sonra şunları yapabilirsiniz:

```
"Supabase'deki tüm tabloları listele"
"profiles tablosundaki producer rolündeki kullanıcıları göster"
"movies tablosuna yeni bir film ekle"
"Bir migration oluştur ve uygula"
```

## Daha Fazla Bilgi

- [Supabase MCP Documentation](https://supabase.com/docs/guides/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)

