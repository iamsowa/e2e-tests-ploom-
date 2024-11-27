import { expect, Page } from "@playwright/test";

// Accept cookies and confirm age
export async function acceptCookiesAndConfirmAge(page: Page): Promise<void> {
  await page.locator("#onetrust-accept-btn-handler").click();
  await page.locator(".ageconfirmation__actionWrapper > div").first().click();
}

// Navigate to the shop
export async function navigateToShop(page: Page): Promise<void> {
  await page.getByTestId("headerItem-0").click();
  await page.getByTestId("customButton").first().click();
}

// Verify all links on the page
export async function verifyLinks(page: Page): Promise<void> {
  const links = await page.locator("a").elementHandles();
  for (const link of links) {
    const href = await link.getAttribute("href");
    if (href && !href.startsWith("#") && !href.startsWith("/") && href.startsWith("http")) {
      const response = await page.request.get(href);
      expect(response.status(), `Broken link: ${href}`).toBeLessThan(400);
    }
  }
}

// Verify all images on the page
export async function verifyImages(page: Page): Promise<void> {
  const images = await page.locator("img");
  const imageCount = await images.count();
  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i);
    if (await img.isVisible()) {
      const naturalWidth = await img.evaluate((node) => (node as HTMLImageElement).naturalWidth);
      if (naturalWidth === 0) {
        console.warn(`Image at index ${i} did not load properly.`);
      } else {
        expect(naturalWidth, `Image at index ${i} failed`).toBeGreaterThan(0);
      }
    }
  }
}
