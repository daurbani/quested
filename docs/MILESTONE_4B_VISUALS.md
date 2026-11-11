# Milestone 4B — Photographic design and image provenance

## Scope
- Photographic, credited collection cards on the homepage and all-collections page
- Scenic photo hero areas for all 7 published collections
- Place-specific photographic hero areas and small thumbnails for 5 verified discovery locations
- Gradient-based visual fallback for the remaining starter destinations; do not misrepresent generic imagery as a named place
- Explicit distinction between 57 **unique discoveries** and entries across 7 overlapping collections
- Responsive image presentation and text-contrast gradients
- No schema changes and no changes to any user's saved completion history

## Photo provenance
All photos are linked from Wikimedia Commons and retain visible photographer, source, and license links next to each usage. Images are responsively cropped in the UI; no artwork is altered on the Commons source page.

| Photo | Photographer/creator | License | Commons source |
| --- | --- | --- | --- |
| Portland panorama from Pittock Mansion | Little Mountain 5 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Pittock_Mansion_View.jpg |
| Mount Hood | Lyn Topinka / USGS | US public domain | https://commons.wikimedia.org/wiki/File:Mount_Hood.jpg |
| Multnomah Falls | Pixel.la | CC0 1.0 | https://commons.wikimedia.org/wiki/File:Multnomah_Falls_in_Oregon.jpg |
| Haystack Rock / Cannon Beach | K. Kendall | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Cannon_Beach_and_Haystock_Rock.jpg |
| Pittock Mansion | Steven Pavlov | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Portland,_OR_%E2%80%94_Pittock_Mansion.jpg |
| Black Butte lookout panorama | Johannes Menzel | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Hood_Jeff_ThreeFingeredJack_BB_150509.jpg |

Only use location-verified images. Source files are served from Commons via Special:FilePath; verify visible image loading on actual devices before calling this fully QA-tested. Remote images may load more slowly or be restricted by the host, in which case the color fallback remains legible. Re-hosting/compressing requires respecting license and attribution requirements.

## Regression checklist
- Homepage displays seven photo cards and 57 unique discoveries
- All-collections page shows seven photo cards; images link to correct collection
- Named photos appear only on correct destination pages (e.g., Mount Hood, Multnomah Falls, Pittock Mansion)
- Text is legible over photographs on phone and desktop; image attribution links are accessible
- Anonymous exploration still works
- A previously saved discovery continues to appear completed in multiple collections
- Saving and removing a completion still advances/reverses each associated collection exactly once
