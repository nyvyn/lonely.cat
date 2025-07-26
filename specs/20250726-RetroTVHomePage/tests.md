Feature: Retro TV Home Page @ui
The visitor sees a nostalgic television scene upon visiting the root URL.

Background:
Given the application is running

Scenario: Display retro TV with cat @smoke
  When the visitor navigates to "/"
  Then the page shows a 1950's TV with static
  And a cat is positioned in front of the TV

Scenario: Respect reduced motion preference @accessibility
  Given the visitor prefers reduced motion
  When the visitor navigates to "/"
  Then no animations play on the page

Scenario: Hover glitch effect @interaction
  When the visitor hovers over the TV
  Then the static animation briefly shows a vertical hold glitch

Scenario Outline: Responsive layout on small screens @responsive
  Given the viewport width is <width> pixels
  When the visitor navigates to "/"
  Then the TV image fits within the viewport without cropping

  Examples:
    | width |
    | 320   |
    | 375   |
