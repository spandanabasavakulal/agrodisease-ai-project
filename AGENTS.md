<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- All backend calls live in `src/services/*Service.ts`; UI never calls fetch directly — keeps FastAPI integration swappable.
- Backend URL comes from `VITE_API_URL` (`src/config/project.ts`); when unset, services return data flagged `isDemo: true` — demo output must always be labelled in UI.
- Model metadata and evaluation metrics are edited only in `src/config/project.ts`; null metrics render as "Not Available".
- Crop/disease normalization between classifier output and recommendation lookup lives in `src/utils/diseaseMapping.ts` — datasets are never merged.
- Current analysis + session history use the store in `src/hooks/useAnalysis.ts` (localStorage) until a database exists.
- Never add pesticide dosages or fabricated model metrics.
