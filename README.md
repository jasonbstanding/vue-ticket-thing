# ticket-thing

Running at https://tickets.jasonbstanding.com

## WTF is this?

I've got every gig ticket* I've ever bought/used stored in my wordpress blog and exposed on a REST API,
so all that HIGHLY VALUABLE DATA needed a way of being surfaced in order to provide the massive benefit
to mankind that it represents.

The first iteration was https://github.com/jasonbstanding/vue-ticket-thing/tree/1st-edition - a highly naive and awful Vue 2 app with some heinously
misused Vuex intended as a way for me to try to learn a few Vue concepts.  However I lost my rag with it and opted for the "just make it work"
approach.

The second version was a Vue 3 rewrite, borne of a need to start from scratch as the Heroku hosting I had stopped being free, and then Vue 2 went EOL.
Hard to say whether ChatGPT saved me any time or not on that one.

This version (v1.1, "The Ticket Thing") is a ground-up rewrite with three views:

- **Gigs** - Card grid browser with filter dropdowns (artist, venue, year, type), sorting, and detail modal
- **Heatmap** - Year x month heatmap grid with colour intensity scale, gigtype dots, sticky headers, year totals, and type filters
- **Spend** - Cumulative spend line chart with per-type breakdown, average ticket price, and milestone markers

Built with Vue 3 (Composition API), Pinia, Vue Router (hash mode for GitHub Pages), Chart.js, and Vite.
Written with Claude Code (Anthropic).

*"gig ticket" is a broad church, taking in plays, films, festivals, tours, museums, and even a dog show. But not transport. Got to draw a line somewhere.

## Project setup

```
npm install
```

### Dev server
```
npm run dev
```

### Build for production
```
npm run build
```

### Environment variables

- `.env` - local dev API endpoint
- `.env.production` - production API endpoint
- `VITE_BASE_URL` - set to repo path (e.g. `/vue-ticket-thing/`) for GitHub Pages deployment

### Other crap to remember
After testing locally, build then commit `dist` - then push the dist subtree to `gh-pages`
```
git add *

git subtree push --prefix dist origin gh-pages
```
(OR if necessary)
```
git push origin `git subtree split --prefix dist main`:gh-pages --force
```
and then remember to set custom domain up again in https://github.com/jasonbstanding/vue-ticket-thing/settings/pages
