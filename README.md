# ticket-thing

Running at https://tickets.jasonbstanding.com

## WTF is this?

I've got every gig ticket* I've ever bought/used stored in my wordpress blog and exposed on a REST API, 
so all that HIGHLY VALUABLE DATA needed a way of being surfaced in order to provide the massive benefit
to mankind that it represents.

The first iteration was https://github.com/jasonbstanding/vue-ticket-thing/tree/1st-edition - a highly naive and awful Vue 2 app with some heinously
misused Vuex intended as a way for me to try to learn a few Vue concepts.  However I lost my rag with it and opted for the "just make it work"
approach.

This version was borne of a need to start from scratch as the Heroku hosting I had stopped being free, and then Vue 2 went EOL.

The Vue 3 version has barely any functionality, although I think works a lot nicer.  No local store is used, because I pulled my finger out and put
some caching on the API layer (instead of hammering my WP site every time).

*"gig ticket" is a broad church, taking in plays, films, festivals, tours, museums, and even a dog show. But not transport.  Got to draw a line somewhere.

### TODO

- [ ] Stats page using DS or something
- [ ] Link back to blog
- [ ] Google Analytics so I can empirically prove that nobody's looking at this
- [ ] Text search of data
- [ ] Instructions on wtf to do with it
- [ ] Maybe some dropdown menus with things in?
- [ ] Deep linking to searches

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Other crap to remember
After testing locally, build then commit `dist` - then push the dist subtree to `gh-pages`
```
git add *

git subtree push --prefix dist origin gh-pages
```
(OR if necessary)
```
git push origin `git subtree split --prefix dist main`:gh-pages --force\n
```
and then remember to set custom domain up again in https://github.com/jasonbstanding/vue-ticket-thing/settings/pages
