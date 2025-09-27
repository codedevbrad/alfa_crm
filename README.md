
NEXT_PUBLIC_SITE_URL=https://thecodebootcamp.com              # prod
NEXT_PUBLIC_SITE_URL=https://codingbootcamp-omega.vercel.app  # preview
NEXT_PUBLIC_SITE_URL=http://localhost:3000                    # local


AUTH_SECRET=********
AUTH_GITHUB_ID=******
AUTH_GITHUB_SECRET=********

AUTH_GOOGLE_ID=*******
AUTH_GOOGLE_SECRET=********


SERVICE_ENCRYPTION_KEY=your-32-character-secret-key-here-123


local branch    - http://localhost:3000
dev   branch    - https://codingbootcamp-omega.vercel.app/
main  branch    - www.thecodebootcamp.com


google auth

    callback urls
    > http://localhost:3000/api/auth/callback/google                     #local
    > https://codingbootcamp-omega.vercel.app/api/auth/callback/google   #preview


github developer settings > create new 0auth App 

    > codebootcamp (loc)
        url - http://localhost:3000
        auth callback url - http://localhost:3000/api/auth/callback/github

    > codebootcamp  (dev)
        url - https://codingbootcamp-omega.vercel.app/
        auth callback url - https://codingbootcamp-omega.vercel.app/api/auth/callback/github


in vercel > set dev (branch) to point to > https://codingbootcamp-omega.vercel.app/

will dev:featureA trigger auto deploys?

https://vercel.com/brad-lumbers-projects/codingbootcamp
https://console.neon.tech/app/projects/rough-frog-90053911?branchId=br-lingering-frost-aba1k3el