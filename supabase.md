# Supabase Flow & Usage in this project:

---

## Setup supabase in your project:

1. Install supabase using `pnpm add @supabase/supabase-js` or `npm i @supabase/supabase-js`.
2. Or you can follow the setup process provided in [Supabase/react](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs).
3. Create `db/supabase.ts`.
4. After than you can create the tables in your supabase database with various Row Level Security(RLS) and set the policies on the tables.
5. Then start performing the operation on db.

## Landing page(/):

User can directly `signin/signup` through the button & they can also enter the url in the input field and click on the `shorten` button, then user get directed to `/auth` page, where they can login or signup using email, password, name & profile picture.

## Auth Flow(/auth):

#### 1. Login Flow:

- User enters email and password and click on `login` button and if valid credentials, then directed to `/dashboard?createNew=${longLink}` or `/dashboard` page, not then toast error message is shown.
- What happens when user click on `login` button:
  1. Get the searchParams named `createNew` if the user has inputed the url in the `landing page` input field.
  2. Created the form with the help of `shadcn/react-hook-form` and form schema using `zod v3`. When user submits form then the `loginUser` function is called that takes email & password and calls the `supabase.auth.signInWithPassword({email, password})`.

#### 2. Signup Flow:

- User enters name, email, password, profile_pic and click on `signup` button if valid credentials, then directed to `/dashboard?createNew=${longLink}` or `/dashboard` page, not then toast error message is shown.
- What happens when user click on `signup` button:
  1. Get the searchParams named `createNew` if the user has inputed the url in the `landing page` input field.
  2. When user submits form then the `signupUser` function is called that takes email, password, name & profile_pic and calls the `supabase.auth.signUp({email, password, ...})`, see it more in `auth-context.tsx`.
  3. To store the profile pic in the supabase, we can setup the storage in supabase and click on `New bucket`, enter the **bucket name** and turn on **Public bucket** and create.
  4. Add `insert` & `select` policies to bucket.
  5. To Store the image in bucket, we can use `supabase.storage.from(bucket_name).upload(fileName, field (type File))`. Then when calling auth.signUp we can use: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`.

## Supabase Realtime Subscription:

1. `useRealtimeUrls.ts` hook (step-by-step):
   - This hook connects Supabase Realtime with React Query cache, so your UI updates instantly when the urls table changes.

   - What **Supabase Realtime** is?
     - Supabase Realtime listens to database changes (via Postgres WAL) and sends events like:
       `INSERT`
       `UPDATE`
       `DELETE`
       So instead of refetching, your app reacts instantly.
   - `export const useRealtimeUrls = (userId?: string)`:
     - Accepts `userId`
     - Only listens to changes for that specific user
   - Create Realtime `channel`:
     - Creates a WebSocket channel
     - Unique per user
       ```
       const channel = supabase.channel(`urls-realtime-${userId}`)
       ```
   - Listen to database changes:
     - `event: "*"` → listen to ALL changes
     - `table: "urls"` → only this table
     - `filter` → only rows where user_id = current user
   - The callback: `(payload) => { ... }`
     - `payload` contains:
       - `eventType`: INSERT | UPDATE | DELETE
       - `new`: new row data
       - `old`: old row data (for delete/update)
     - Updating React Query cache:

       ```
       queryClient.setQueryData(["urls", userId], (old = []) => { ... })
       ```

       - Instead of refetching, directly modifies cached data.

     - Handling each event:
       - `INSERT`: Adds new URL to cache. Prevents duplicates
         ```
             if (payload.eventType === "INSERT") {
               if (old.find((u) => u.id === payload.new.id)) return old;
               return [...old, payload.new];
             }
         ```
       - `DELETE`: Removes deleted item from cache
         ```
         if (payload.eventType === "DELETE") {
           return old.filter((url) => url.id !== payload.old.id);
         }
         ```
       - `UPDATE`: Replaces updated item
         ```
         if (payload.eventType === "UPDATE") {
           return old.map((url) =>
             url.id === payload.new.id ? payload.new : url
           );
         }
         ```

   - Subscribe to channel: `subscribe()`, Starts listening via WebSocket.
   - Cleanup: Prevents memory leaks. Stops listening when component unmounts
     ```
     return () => {
       supabase.removeChannel(channel);
     };
     ```
   - `Flow Summary`:
     1. User opens app
     2. Hook subscribes to `urls` table changes
     3. Any DB change triggers event
     4. Cache updates instantly
     5. UI re-renders automatically
     - This hook: **"Listen to database → update React Query cache → UI updates automatically"**

2. `useRealtimeClicks.ts` hook (step-by-step):
   - This hook connects Supabase Realtime with React Query cache, so your UI updates instantly when the `clicks` table changes.

   - `export const useRealtimeClicks = (urlIds: string[])`:
     - Accepts an array of `urlIds`
     - Only tracks clicks related to those specific URLs

   - Create Realtime `channel`:
     - Creates a WebSocket channel
     - Shared channel (not user-specific here)

       ```
       const channel = supabase.channel("clicks-realtime")
       ```

   - Listen to database changes:
     - `event: "*"` → listen to ALL changes
     - `table: "clicks"` → only this table
     - No filter → receives all click events (filtering is done in frontend)

   - The callback: `(payload) => { ... }`
     - `payload` contains:
       - `eventType`: INSERT | UPDATE | DELETE
       - `new`: new row data
       - `old`: old row data

     - Updating React Query cache:

       ```
       queryClient.setQueryData(["clicks", urlIds], (old = []) => { ... })
       ```

       - Directly updates cached clicks data instead of refetching

   - Handling events:
     - `INSERT`: Adds new click only if it belongs to tracked URLs

       ```
       if (payload.eventType === "INSERT") {
         // Ignore clicks not related to current URLs
         if (!urlIds.includes(payload.new.url_id)) return old;

         // Prevent duplicates
         if (old.find((u) => u.id === payload.new.id)) return old;

         return [...old, payload.new];
       }
       ```

     - `UPDATE` and `DELETE`:
       - Not handled here
       - Reason: clicks are typically append-only (you usually don’t update/delete them)

   - Subscribe to channel:

   - Cleanup:
     - Prevents memory leaks
     - Stops listening when component unmounts

       ```
       return () => {
         supabase.removeChannel(channel);
       };
       ```

   - `Flow Summary`:
     1. User loads URLs
     2. Hook subscribes to `clicks` table
     3. New click is inserted in database
     4. Realtime event fires
     5. Hook checks if click belongs to tracked URLs
     6. Cache updates instantly
     7. UI re-renders automatically

   - This hook:
     **"Listen to clicks → filter relevant ones → update cache → UI updates automatically"**

   - Key difference from `useRealtimeUrls`:
     - No backend filter → filtering happens in frontend (`urlIds.includes`)
     - Only handles `INSERT` → optimized for analytics-style data (append-only)
