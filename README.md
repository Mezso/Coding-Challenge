# Coding-Challenge - Playwright UI Tests
Tester : Carlo San Jose

📋 About
This project contains automated UI tests written using Playwright for the Spree Commerce Demo Store. The goal is to validate key user flows and ensure the core functionalities of the application are working as expected.

This repository serves as my submission for the QA Automation Engineer coding challenge.

UI Test Scenarios:
1. Navigate to the Spree Commerce demo store.
2. Click on the user icon and Sign Up as a new user from the registration page from
the side menu. (Log out if needed)
3. Log in with the newly registered user credentials.
4. Browse products and open a product detail page.
5. Add the product to cart.
6. Go to the cart and verify the product details (name, quantity, price).
7. Proceed to checkout and complete the following:
○ Add a shipping address.
○ Select a shipping method.
○ Verify the different delivery and pricing options.
○ Select a payment method. (Kindly refer test card details on the checkout)
○ Complete the order.
8. Verify the order confirmation page is shown with an order number and success
message.
9. Add assertions at each key step (e.g., URL validation, UI messages, order
confirmation, etc.).
