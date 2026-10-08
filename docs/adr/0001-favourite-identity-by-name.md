# Favourite identity keyed by Menu Item name

Menu Item cards in `menu.html` have no unique ID attributes. Rather than retrofit `data-id` values onto all 20 cards, we identify Favourites by their `h3.menu-card__name` text content. All current names are unique, so this is safe today.

The trade-off: if a Menu Item is renamed or two items share a name in future, the Favourite Store silently breaks for affected items. Accept this risk because the menu is small and manually maintained; a name collision is immediately visible during authoring.

## Considered Options

- **Name (chosen)**: no HTML changes required; human-readable in localStorage
- **Sequential `data-id`**: requires adding an attribute to every card; IDs are meaningless without the HTML to cross-reference
