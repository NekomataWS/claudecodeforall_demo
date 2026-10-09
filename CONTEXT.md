# Mind Cafe Website

A static marketing and ordering website for Mind Cafe, a specialty coffee cafe. The site lets Guests browse the menu, view the space, and make reservations.

## Language

**Guest**:
A person browsing the website who is not signed in. Guests can browse, reserve and order without an account.
_Avoid_: User, visitor, customer

**Member**:
A person who registered an account (email + password) and signs in. Member details live in the `profiles` table of the Mind Cafe Supabase project; sign-in is handled by Supabase Auth. Favourites and the cart remain browser-local for now.
_Avoid_: User, account holder, customer

**Menu Item**:
A drink or food offered for sale at Mind Cafe. Has a name, category, description, and price.
_Avoid_: Product, item, drink (too narrow)

### Favourites

**Favourite**:
A Menu Item a Guest has marked for personal reference. Persisted in the Guest's browser across visits.
_Avoid_: Bookmark, saved item, liked item

**Favourite Store**:
The browser-local collection of a Guest's Favourites, held in `localStorage`. The single source of truth for which Menu Items are favourited.
_Avoid_: Favourites list, saved list
