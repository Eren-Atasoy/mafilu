import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on 'Giriş' button to start login process as Producer
        frame = context.pages[-1]
        # Click on 'Giriş' button to open login form
        elem = frame.locator('xpath=html/body/nav/div/div/div[2]/a/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input email and password, then click 'Giriş Yap' button to login as Producer
        frame = context.pages[-1]
        # Input email for Producer login
        elem = frame.locator('xpath=html/body/div[2]/div[2]/main/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('domateskafasi@gmail.com')
        

        frame = context.pages[-1]
        # Input password for Producer login
        elem = frame.locator('xpath=html/body/div[2]/div[2]/main/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Erenatasoy123.')
        

        frame = context.pages[-1]
        # Click 'Giriş Yap' button to submit login form
        elem = frame.locator('xpath=html/body/div[2]/div[2]/main/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Yapımcı Paneli' link to go to the Producer dashboard
        frame = context.pages[-1]
        # Click on 'Yapımcı Paneli' link to navigate to Producer dashboard
        elem = frame.locator('xpath=html/body/footer/div/div/div[3]/ul/li[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to 'Kazançlarım' (Earnings) tab to verify earnings projections and payout history
        frame = context.pages[-1]
        # Click on 'Kazançlarım' tab to view earnings projections and payout history
        elem = frame.locator('xpath=html/body/div[2]/aside/nav/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Kazançlarım').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gelirlerinizi takip edin ve ödemelerinizi yönetin').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$2,450.75').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$385.50').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=-8.25%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$185.50').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=12.580').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Kayıp Şehir - İzlenme geliri').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2024-12-25').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=+$45.50').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tamamlandı').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gece Yarısı - İzlenme geliri').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2024-12-24').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=+$32.00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Banka hesabına transfer').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2024-12-20').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$200.00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Kayıp Şehir - İzlenme geliri').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2024-12-18').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=+$28.75').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Bekliyor').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sessiz Çığlık - İzlenme geliri').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2024-12-15').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=+$15.25').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=En Çok Kazandıran Filmler').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Kayıp Şehir').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4.520 izlenme').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$1250.50').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gece Yarısı').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3.200 izlenme').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$680.25').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sessiz Çığlık').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2.100 izlenme').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$320.00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Minimum ödeme tutarı $50'dır. Ödemeler her ayın 1'inde yapılır.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    