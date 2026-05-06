Drop image assets here. The platform references these by exact
filename - case-sensitive, no spaces, no Windows ".jpg.jpg" double
extensions.

EXPECTED FILES
==============

  abumusa.jpg            Used as the Mission step's captured SAR
                         scene. Rendered at 3:2 aspect inside a
                         framed card; a 1200x800-ish JPG is fine.

  iran_zoom.jpg          Constellation block - shown in the media
                         gallery alongside the orbit cinematic.

  payload_slewing.jpg    Constellation block - illustrates the slew
                         capability (off-nadir tilt).

  middle_east_target.jpg Constellation block - target clustering
                         visualisation over MENA.

OPTIONAL FILE EXTENSIONS
========================
The components accept .jpg, .jpeg, .png, or .webp as long as the
basename matches. If you only have .png, drop those - the platform's
<img> elements infer the extension from the actual file you commit.

WINDOWS GOTCHA
==============
File Explorer's "Hide known extensions" option silently appends the
extension when you rename. If a previous drop landed as
abumusa.jpg.jpg, the platform will 404 on it. Turn extensions on
(Explorer ribbon -> View -> File name extensions) and rename
cleanly.
