import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage.ts';
import { Category } from '../pages/categorypage.ts';
import { Checkout } from '../pages/checkoutpage.ts';
import * as Common from '../utils/common';
import path from 'path';

let testData: any;

test.describe.configure({ mode: 'serial' });
test.setTimeout(60000)
test.describe('Product link checks on homepage', () => {
test.beforeAll(() => {
    const testDataPath = path.resolve('data/testdata.json');
    Common.updateTestDataEmail('data/testdata.json');
    testData = Common.getTestData('data/testdata.json');
});


test.beforeEach(async ({ page }) => {
     // ✅ Maximize the browser window (Chromium only)
    const session = await page.context().newCDPSession(page);
    const { windowId } = await session.send('Browser.getWindowForTarget');
    await session.send('Browser.setWindowBounds', {
      windowId,
      bounds: { windowState: 'maximized' }
    });
    const homePage = new HomePage(page);

    await homePage.goto(testData.url);
    await page.waitForLoadState('load');
  });

test('Navigate to the Spree Commerce demo store',async({page})=>{
    const homePage = new HomePage(page);
    await homePage.expectTitle(testData.title);
})


test('Create account', async ({ page }) => {

    const homePage = new HomePage(page);
    await test.step('Step 1 : Click Account Login and click Sign Up', async () =>{
        
        await homePage.clickAccountButton();
        await homePage.clickSignUpLink();

    })

    await test.step('Step 2: Fill the neccesary field', async () =>{
        for (const user of testData.user){
            await homePage.fillSignupForm(user.email,user.password);
        }
        
    })

    await test.step('Step 3: Log out', async () =>{

        await homePage.logout();

    })

  });


  test('Create Order and Check Out', async ({ page }) => {

    const homePage = new HomePage(page);
    const category = new Category(page);
    const checkout = new Checkout(page);
    await test.step('Step 1 : Click Account Login and login', async () =>{
        
        await homePage.clickAccountButton();
        for (const user of testData.user){
            await homePage.login(user.email,user.password);
        }
        

    })

    await test.step('Step 2: Browse Product and Add to Cart', async () => {
        
        for ( const product of testData.products){
            await homePage.clickCategory(product.category);
            await category.ClickProduct(product.name);
            

            if (product.size && product.size.trim() !== '') {
                await category.SelectSize(product.size);
                }
            
            
            await category.AddQuantity(product.qty);
            
            await category.AddtoCart();
            await category.CloseCart();
        }
        

    })

    await test.step('Step 3: Validate the cart and checkout', async () =>{

        await homePage.clickCartButton();

        for (const testProduct of testData.products) {
            const productName = await category.getProductTitle(testProduct.name);
            const productPrice = await category.getProductPrice(testProduct.name);
            const productQty = await category.getProductQty(testProduct.name);

            // Name check: partial match is fine
            expect(productName).toContain(testProduct.name);

            // Price check: Make sure both sides are strings or numbers
            expect(productPrice).toContain(String(testProduct.unitPrice));

            // Quantity check: Convert both sides to number for safe comparison
            expect(Number(productQty)).toBe(Number(testProduct.qty));
            }
        
        await category.ClickCheckOut();

        

    })

    await test.step('Step 4: Proceed on Checkout and Fillout Shipping Address', async() =>{

        for (const shippingAddress of testData.user){
            await checkout.FillShippingAddress(
                shippingAddress.country,
                shippingAddress.firstName,
                shippingAddress.lastName,
                shippingAddress.address,
                shippingAddress.city,
                shippingAddress.postal);
        }
        
        
        await checkout.ClickSave();

    })

    await test.step('Step 5: Verify delivery method and select one', async() =>{

        for ( const delivery of testData.delivery){
            const methodName = await checkout.getDeliveryMethod(delivery.method);
            const DeliveryDays = await checkout.getDeliveryDays(delivery.method);
            const DeliveryPrice = await checkout.getDeliveryPrice(delivery.method);

        
            expect(methodName).toContain(delivery.method);
            expect(DeliveryDays).toContain(delivery.deliveryDay);
            expect(DeliveryPrice).toContain(delivery.price);
            

        }
        await checkout.clickDeliveryMethod('Premium')
        await checkout.ClickSave();
    })

    await test.step('Step 6: Select Payment and Complete the Order', async() =>{

        for ( const payment of testData.payment){

            await checkout.clickPaymentMethod(payment.paymentMethod);
            const paymentMethod = await checkout.getPaymentMethod(payment.paymentMethod);
            expect(paymentMethod).toContain(payment.paymentMethod);
            if(payment.paymentMethod === 'Stripe'){
                
                await checkout.fillCardDetailsWithRetry(payment.cardType,payment.cardNo,payment.expiryDate,payment.securityCode);
            }

        }
        
        await checkout.ClickPayNow();


    })

    await test.step('Step 7: Verify the Completed Order',async() =>{
        await checkout.getOrderNumber();
        const orderConfirmn = await checkout.getOrderConfirmation();

        expect(orderConfirmn).toContain('Your order is confirmed');

    })
    
    

  });


});