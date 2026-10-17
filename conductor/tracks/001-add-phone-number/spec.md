# Specification: Add Phone Number

## Objective
Include the phone number `[PHONE-REMOVED]` in the top navigation bar and the contact section of `index.html`.

## Requirements
1. **Topbar**:
   - Add a clickable link: "Call The Commander: [PHONE-REMOVED]".
   - Clicking the link should initiate a phone call (`tel:[PHONE-REMOVED]`).
   - Style: Font size must match the updated (larger) navigation menu items.

2. **Navigation Menu**:
   - Increase the font size of ALL navigation menu items for better visibility.

3. **Contact Area**:
   - Create a "nice little panel" for the phone number.
   - The number `[PHONE-REMOVED]` must be clearly visible.
   - **The entire panel must be clickable** to initiate the call.
   - Style: Consistent with Gillsystems design, but with a larger font.

4. **Footer**:
   - Add a clickable phone number to the footer as well.

## Technical Details
- Targets: `index.html`, `styles.css`.
- URL format: `tel:[PHONE-REMOVED]`.
