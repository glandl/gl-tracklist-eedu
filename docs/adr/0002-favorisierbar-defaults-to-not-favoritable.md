# Favorisierbar defaults to "not favoritable" when blank

The new `Favorisierbar` column on the Tracks sheet controls whether a TrackEntry can be added to the Favoritenliste (e.g. a Pause should not be favoritable). We chose `"J"` as the only value that grants favoritability — a blank cell, `"N"`, or anything else means the star toggle and detail link are hidden in the Pivot Table.

This is the opposite of the usual "blank = permissive" default, and it means every existing row in the Tracks sheet needs an explicit `"J"` to keep its star and detail link. We accepted this because the alternative (blank = favoritable) would have required marking every Pause/Break row with `"N"` instead, which is easy to forget and would silently let non-sessions into people's Favoritenliste. Requiring an explicit opt-in (`"J"`) makes the omission visible immediately (the session simply has no star), rather than allowing an unwanted entry to slip through unnoticed.
