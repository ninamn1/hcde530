def count_words(text: str) -> int:
    """Rough word count by splitting on whitespace (same idea as demo_word_count)."""
    return len(text.split())

def main() -> None:
    reviews = [
        "Love the clean layout and the reminders are actually helpful.",
        "Crashes every time I try to upload a photo, please fix.",
        "Great concept but the onboarding is confusing and too long.",
        "Search is fast and accurate, exactly what I needed.",
        "Notifications are way too aggressive even after I turned them off.",
        "The new update made the text tiny and hard to read.",
        "Sync works perfectly between my phone and laptop.",
        "I keep getting logged out and it forgets my settings.",
        "Beautiful design, but it takes forever to load on Wi‑Fi.",
        "Offline mode saved me on a flight, thank you.",
        "The calendar view is cluttered and I can’t filter anything.",
        "Excellent accessibility options and screen reader support.",
        "Audio playback randomly stops when my screen locks.",
        "I like the widgets, but customization is limited.",
        "Too many popups asking for a subscription after every click.",
        "Customer support responded quickly and solved my issue.",
        "The app feels polished and the animations are smooth.",
        "Can you add dark mode scheduling instead of manual only?",
        "Exporting data to CSV was easy and super useful.",
        "It duplicates entries when I refresh, really frustrating.",
        "The tutorial was clear and I got started in minutes.",
        "Privacy settings are hard to find and the defaults feel wrong.",
        "Great for quick notes, but formatting options are missing.",
        "I wish the app remembered my last tab instead of resetting.",
        "Battery drain is noticeable after using it for ten minutes.",
        "The latest build fixed my bug, thanks for listening.",
        "Maps feature is inaccurate and shows the wrong location.",
        "I like the idea, but it’s not reliable enough for daily use.",
        "Scrolling stutters on older devices and feels laggy.",
        "The color contrast in the settings menu is too low.",
        "Fast sign-in with Google, but it failed with Apple ID.",
        "Sharing to friends is seamless and the invite flow is nice.",
        "The app is helpful, but the ads are intrusive and loud.",
        "I accidentally deleted a list and there’s no undo.",
        "The help articles are outdated and don’t match the UI.",
        "Gesture controls are inconsistent and hard to learn.",
        "I appreciate the simple interface and minimal clutter.",
        "Why does it ask for location permissions for a notes app?",
        "Great for tracking habits, the streaks motivate me.",
        "It freezes on the payment screen and I can’t subscribe.",
        "The font choices are limited; I’d love more options.",
        "The filters are powerful once you figure them out.",
        "This would be perfect if it supported bulk editing.",
        "The keyboard covers the text field and I can’t see what I type.",
        "Love it, but please stop changing the layout every update.",
        "The app keeps playing sound even when muted.",
        "Simple and effective. Does exactly what it promises.",
        "The loading spinner never ends when my connection is weak.",
        "I can’t find where to change my email address in settings.",
        "Five stars for the redesign—cleaner, faster, and easier.",
    ]

    print(f"{'Review #':<8} {'Words':<6} {'Preview (first 60 chars)'}")
    print("-" * 80)

    word_counts: list[int] = []

    # Walk every review: label with 1-based review numbers (easier to read than starting at 0), count words, show a short preview.
    for i, review in enumerate(reviews, start=1):
        n = count_words(review)
        word_counts.append(n)

        # First 60 characters only so long reviews don't fill the screen; counting still uses the full string.
        preview = review if len(review) <= 60 else review[:60] + "..."
        print(f"{i:<8} {n:<6} {preview}")

    # Totals and min/max/average give a quick quantitative overview next to the row-by-row table.
    print()
    print("── Summary ─────────────────────────────────")
    print(f"  Total reviews  : {len(word_counts)}")
    print(f"  Shortest       : {min(word_counts)} words")
    print(f"  Longest        : {max(word_counts)} words")
    print(f"  Average        : {sum(word_counts) / len(word_counts):.1f} words")


if __name__ == "__main__":
    main()

