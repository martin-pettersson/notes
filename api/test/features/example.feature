Feature: Cart stock handling

  Defines how stock issues are handled in cart.

  Rule: Only one user can check out a given product

    Background:
      Given two users in a session
      And the following products available for purchase
        | SKU       | quantity |
        | 000000-01 | 0        |
        | 000000-02 | 2        |
        | 000000-03 | 10       |

    Example: Same item in multiple carts simultaneously
      Given both users have product 000000-01 in their carts
      When user one checks out
      Then it should be successful
      But when user two checks out
      Then the checkout should fail
