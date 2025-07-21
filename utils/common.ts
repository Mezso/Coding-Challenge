import { Locator, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function generateRandomEmail() {
  return `testuser_${Date.now()}@mail.com`;
}

export function updateTestDataEmail(filePath: string): string {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Test data file not found at: ${resolvedPath}`);
  }

  const rawData = fs.readFileSync(resolvedPath, 'utf-8');
  const data = JSON.parse(rawData);
  const newEmail = generateRandomEmail();

  // Update only if different
  if (data.user?.[0]?.email !== newEmail) {
    data.user[0].email = newEmail;
    fs.writeFileSync(resolvedPath, JSON.stringify(data, null, 2));

    console.log(`[testdata] Updated email to ${newEmail}`);
  } else {
    console.log(`[testdata] Email already up to date`);
  }

  return newEmail;
}

export function getTestData(filePath: string): any {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Test data file not found at: ${resolvedPath}`);
  }

  const rawData = fs.readFileSync(resolvedPath, 'utf-8');
  return JSON.parse(rawData);
}


type SelectorType = 'xpath' | 'role' | 'text' | 'css' | 'testid';

interface ClickOptions {
  type: SelectorType;
  value: string;
  roleName?: string; // used when type is "role"
  timeout?: number;
  frameSelector?: string;
}

export async function smartClick(page: Page, options: ClickOptions) {
  const { type, value, roleName, timeout = 5000,frameSelector } = options;

  let element: Locator;

  try {
    if (frameSelector) {
      // Wait for iframe to appear in the DOM and be attached
      //await page.waitForSelector(frameSelector, { state: 'attached', timeout });

      const frame = page.frameLocator(frameSelector);

      // Optional: Wait for the frame's body to ensure content is loaded
      //await frame.locator('body').waitFor({ state: 'visible', timeout });

      switch (type) {
        case 'xpath':
          element = frame.locator(`xpath=${value}`);
          break;
        case 'css':
          element = frame.locator(value);
          break;
        case 'text':
          element = frame.getByText(value);
          break;
        case 'testid':
        element = frame.getByTestId(value);
          break;
        case 'role':
          if (!roleName) {
            throw new Error('roleName must be provided for "role" type');
          }
          element = frame.getByRole(roleName as any, { name: value });
          break;
        default:
          throw new Error(`Unsupported selector type in frame: ${type}`);
      }
    } else {
      switch (type) {
        case 'xpath':
          element = page.locator(`xpath=${value}`);
          break;
        case 'css':
          element = page.locator(value);
          break;
        case 'text':
          element = page.getByText(value);
          break;
        case 'testid':
        element = page.getByTestId(value);
          break;
        case 'role':
          if (!roleName) {
            throw new Error('roleName must be provided for "role" type');
          }
          element = page.getByRole(roleName as any, { name: value });
          break;
        default:
          throw new Error(`Unsupported selector type: ${type}`);
      }
    }

    await element.waitFor({ state: 'visible', timeout });
    await element.scrollIntoViewIfNeeded();
    await element.click();
  } catch (error) {
    console.error(`❌ Failed to click using type: ${type}, value: ${value}`);
    await page.screenshot({ path: `click-error-${type}.png` });
    throw error;
  }
}

interface FillOptions {
  type: SelectorType;
  value: string;         // Locator value
  roleName?: string;     // Role, if type is 'role'
  timeout?: number;      // Optional timeout
  textToType: string | number;    // The actual text to type in the field
  frameSelector?: string;
}

export async function smartFill(page: Page, options: FillOptions) {
  const { type, value, roleName, timeout = 5000, textToType, frameSelector } = options;

  let element: Locator;

  try {
    if (frameSelector) {

      const iframeLocator = page.locator(frameSelector);
      await iframeLocator.waitFor({ state: 'attached', timeout });

      const frame = await iframeLocator.contentFrame();

      switch (type) {
        case 'xpath':
          element = frame.locator(`xpath=${value}`);
          break;
        case 'css':
          element = frame.locator(value);
          break;
        case 'text':
          element = frame.getByText(value);
          break;
        case 'testid':
        element = frame.getByTestId(value);
          break;
        case 'role':
          if (!roleName) {
            throw new Error('roleName must be provided for "role" type inside frame');
          }
          element = frame.getByRole(roleName as any, { name: value });
          break;
        default:
          throw new Error(`Unsupported selector type in frame: ${type}`);
      }
    } else {
      switch (type) {
        case 'xpath':
          element = page.locator(`xpath=${value}`);
          break;
        case 'css':
          element = page.locator(value);
          break;
        case 'text':
          element = page.getByText(value);
          break;
        case 'testid':
        element = page.getByTestId(value);
          break;
        case 'role':
          if (!roleName) {
            throw new Error('roleName must be provided for "role" type');
          }
          element = page.getByRole(roleName as any, { name: value });
          break;
        default:
          throw new Error(`Unsupported selector type: ${type}`);
      }
    }

    await element.waitFor({ state: 'visible', timeout });
    await element.scrollIntoViewIfNeeded();

    await element.click();
    await element.fill('');
    await element.fill(String(textToType));
  } catch (error) {
    console.error(`❌ Failed to fill using type: ${type}, value: ${value}`);
    await page.screenshot({ path: `fill-error-${type}.png` });
    throw error;
  }

  
}


interface GetOptions {
  type: SelectorType;
  value: string | RegExp;         // Locator value
  roleName?: string;     // Role, if type is 'role'
  timeout?: number;      // Optional timeout
}

export async function smartGet(page: Page, options: GetOptions): Promise<Locator> {
  const { type, value, roleName, timeout = 5000 } = options;

  let element: Locator;

  try {
    switch (type) {
      case 'xpath':
        if (typeof value !== 'string') throw new Error('XPath must be a string');
        return page.locator(`xpath=${value}`);
      case 'css':
        if (typeof value !== 'string') throw new Error('CSS selector must be a string');
        return page.locator(value);
        
      case 'text':
        if (typeof value !== 'string') throw new Error('CSS selector must be a string');
        return page.getByText(value);
        
      case 'role':
        if (!roleName) {
          throw new Error('roleName must be provided for "role" type');
        }
        element = page.getByRole(roleName as any, { name: value });
        break;
      default:
        throw new Error(`Unsupported selector type: ${type}`);
    }

    await element.waitFor({ state: 'visible', timeout });
    await element.scrollIntoViewIfNeeded();

    return element;

  } catch (error) {
    console.error(`❌ Failed to get element using type: ${type}, value: ${value}`);
    await page.screenshot({ path: `get-error-${type}.png` });
    throw error;
  }
}

export async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  let lastError;
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Attempt ${i} failed:`, err);
      if (i < retries) await new Promise(res => setTimeout(res, delay));
    }
  }
  throw lastError;
}

