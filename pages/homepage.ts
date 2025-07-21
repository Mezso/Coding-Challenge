import { Page, expect } from '@playwright/test';
import * as Common from '../utils/common';


export class HomePage {
  constructor(private page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async expectTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle));
  }

  async clickAccountButton() {
    
    await Common.smartClick(this.page, {
        type: 'role',
        roleName:'link',
        value:'My Account'
        //value: '//div[contains(@class, "justify-end")]//button[contains(@data-action, "slideover-account#toggle")]'
    });
  }
  async clickCartButton() {
    
    await Common.smartClick(this.page, {
        type: 'xpath',
        value: `//div[contains(@class, "justify-end")]//span[contains(text(),'Items in cart, View bag')]`
    });
  }
  async clickSignUpLink() {
    await Common.smartClick(this.page, {
      type: 'role',
      roleName: 'link',
      value: 'Sign Up'
    });

    await expect(this.page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
  }

  async fillSignupForm(email: string, password: string) {
    await Common.smartFill(this.page, {
      type: 'xpath',
      value: "//input[@id='user_email']",
      textToType: email
    });

    await Common.smartFill(this.page, {
      type: 'xpath',
      value: "//input[@id='user_password']",
      textToType: password
    });

    await Common.smartFill(this.page, {
      type: 'xpath',
      value: "//input[@id='user_password_confirmation']",
      textToType: password
    });

    await Common.smartClick(this.page, {
      type: 'role',
      roleName: 'button',
      value: 'Sign Up'
    });

    await expect(this.page.getByText('Welcome! You have signed up successfully.')).toBeVisible();
  }
  async login (email: string, password: string){

        await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();

        await Common.smartFill(this.page, {
        type: 'xpath',
        value: "//input[@id='user_email']",
        textToType: email
        });

        await Common.smartFill(this.page, {
        type: 'xpath',
        value: "//input[@id='user_password']",
        textToType: password
        });

        await Common.smartClick(this.page,{
        type : 'role',
        roleName : 'button',
        value: 'Login'
        });

        await expect(this.page.getByText('Signed in successfully.')).toBeVisible();

  }

  async logout() {
    await Common.smartClick(this.page,{
            type : 'xpath',
            value: '//div[contains(@class, "justify-end")]//a[@href="/account"]'
            });
    
            await expect(this.page).toHaveURL(/.*\/account\/.*/);
    
            await Common.smartClick(this.page,{
            type : 'role',
            roleName : 'button',
            value: 'Log out'
            });
    
            await expect(this.page.getByText('Signed out successfully.')).toBeVisible();
  }

  async clickCategory(category : string) {

    await Common.smartClick(this.page,{
            type : 'xpath',
            value: `//ancestor::div[contains(@class, 'justify-center')]//span[text()='${category}']`,
            });
    
    await expect(this.page.getByRole('heading', { name: category })).toBeVisible();
  }

}




