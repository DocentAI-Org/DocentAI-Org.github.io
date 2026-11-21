<p align="center"><img src="assets/img/docentai-logo-144.png" alt="DocentAI" width="96"></p>

# DocentAI · website

The website of DocentAI, a teacher-guided AI tutor. The tutor answers students only from the
material their teacher has validated, cites the source of every answer and says plainly when the
material does not cover a question.

The site is a single static page (HTML, CSS and plain JavaScript, no build step and no
dependencies), in English and Spanish, with light and dark themes. Its demos are scripted and use
fictional courses and data.

## Run it locally

```bash
python3 -m http.server 4321   # then open http://localhost:4321
```

## Structure

```
index.html            the page (English copy, icons inlined)
assets/css/site.css   styles
assets/js/es.js       Spanish copy
assets/js/content.js  the demos' content, in both languages
assets/js/site.js     language, theme, demos, section index and timeline
assets/fonts/         Geist and Geist Mono
assets/img/           DocentAI and IMFAHE logos
assets/video/         the presentation video's poster (the video plays from YouTube)
```

## Related repositories

- [DocentAI-Org/frontend](https://github.com/DocentAI-Org/frontend): the web app for students and
  teachers.
- [DocentAI-Org/backend](https://github.com/DocentAI-Org/backend): the API.

## Acknowledgements

Project funded by the IMFAHE Foundation through its Global Idea Competition · Nodal Award 2026.

## Licence

Apache License 2.0, see [LICENSE](LICENSE). Third-party assets keep their own licences: the Geist
fonts are under the SIL Open Font License 1.1 (`assets/fonts/OFL-geist.txt`) the icons come
from [Lucide](https://lucide.dev) (ISC), and the video's music is "Wholesome" by Kevin MacLeod
(incompetech.com), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
