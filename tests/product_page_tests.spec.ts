import { test, expect } from "@playwright/test";
import { acceptCookiesAndConfirmAge, navigateToShop, verifyLinks, verifyImages } from "./helpers/helpers";

const markets = [
  { name: "UK", url: "https://www.ploom.co.uk/en" },
  // { name: "PL", url: "https://www.ploom.pl/pl" },
];

const productSKU = "ploom-x-advanced";

test.describe("Ploom", () => {
  for (const market of markets) {
    test.describe(`Tests for ${market.name} market`, () => {

      // TC1: Add product to the cart
      test(`Verify if it is possible to add a product to the cart for market ${market.name}`, async ({ page }) => {
        await page.goto(market.url);
        await acceptCookiesAndConfirmAge(page);
        await navigateToShop(page);

        await page.locator(`[data-sku="${productSKU}"]`).click();
        await page.getByTestId("pdpAddToProduct").click();

        // Verify product in the cart
        await page.getByTestId("miniCartCheckoutButton").click();
        await expect(page.getByTestId("regular-cart-list")).toContainText("Ploom X Advanced Black");

        // Verify number of items in the basket
        const basketCountText = await page.locator('strong[data-testid="page-layout-subtitle"]').innerText();
        expect(parseInt(basketCountText)).toBeGreaterThan(0);
      });

      // TC2: Remove product from the cart
      test(`Verify if it is possible to remove a product from the cart for market ${market.name}`, async ({ page }) => {
        await page.goto(market.url);
        await acceptCookiesAndConfirmAge(page);
        await navigateToShop(page);

        await page.locator(`[data-sku="${productSKU}"]`).click();
        await page.getByTestId("pdpAddToProduct").click();

        // Remove product from the cart
        await page.getByTestId("miniCartCheckoutButton").click();
        await page.getByTestId("regular-cart-list").getByTestId("quantityMinus").click();
        await expect(page.locator("#one-page-checkout")).toContainText(
          "You have no items in your shopping cart at the moment."
        );

        // Verify number of items in the basket
        const basketCount = await page.locator(".mini-cart__header-count").innerText();
        expect(parseInt(basketCount)).toBe(0);
      });

      // TC3: Verify broken links and images
      test(`Verify if there are any broken links or images on the product page for market ${market.name}`, async ({ page }) => {
        await page.goto(market.url);
        await acceptCookiesAndConfirmAge(page);
        await navigateToShop(page);

        await page.locator(`[data-sku="${productSKU}"]`).click();

        // Check all links on the product page
        await verifyLinks(page);

        // Verify all images load correctly
        await verifyImages(page);
      });
    });
  }
});
