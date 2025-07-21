import { Page, expect, Locator } from '@playwright/test';
import * as Common from '../utils/common';


export class Category {
  constructor(private page: Page) {}

async ClickProduct(product : string){
    await Common.smartClick(this.page, {
        type: 'role',
        roleName: 'heading',
        value: product
    });

    await expect(this.page.getByRole('heading', { name: product })).toBeVisible();

}
async AddQuantity(quantity : number){
    const quantityInput = this.page.locator("//input[@id='quantity']");

    // Wait for input to be re-attached or stable
    await quantityInput.waitFor({ state: 'attached' }); 

    await Common.smartFill(this.page,{
      type: 'xpath',
      value: "//input[@id='quantity']",
      textToType: quantity
    });
}

async SelectSize(size : string){
  
    await Common.smartClick(this.page,{
      type:'xpath',
      value:'//button[@data-dropdown-target="button"]/legend'
    });

    await Common.smartClick(this.page,{
      type:'xpath',
      value: `//label[p[text()='${size}']]`
    });

    
}

async AddtoCart(){
    await Common.smartClick(this.page,{
        type: 'role',
        roleName: 'button',
        value: 'Add to Cart'
    });
}

async CloseCart(){
    await Common.smartClick(this.page,{
        type: 'role',
        roleName: 'button',
        value: 'Close sidebar'
    })

}

async ClickCheckOut(){
    await Common.smartClick(this.page,{
      type:'role',
      roleName: 'link',
      value:'Checkout'
    })
}

async getProductTitle(productName : string): Promise<string | null> {
    const productTitle: Locator = await Common.smartGet(this.page, {
      type: 'xpath',
      value: `//a[text()="${productName}"]`
    });

    return await productTitle.textContent();
  }

  async getProductPrice(productName : string): Promise<string | null> {
    const productPrice: Locator = await Common.smartGet(this.page, {
      type: 'xpath',
      value: `//a[text()="${productName}"]/parent::div/following-sibling::div/span`
    });

    return await productPrice.textContent();
  }

  async getProductQty(productName : string): Promise<string | null> {
    const productQty: Locator = await Common.smartGet(this.page, {
      type: 'xpath',
      value: `//a[text()="${productName}"]/parent::div/following-sibling::div//input[contains(@id,'line_item_quantity')]`
    });

    return await productQty.inputValue();
  }

}