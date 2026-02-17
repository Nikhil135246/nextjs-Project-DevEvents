## ✅ Let's Start Project 

### Pre Setup

1. Update app/globals.css
2. npm install --save-dev tw-animate-css
3. Get public folder from Assests.zip and copy favicon icon too in app.
4. we change fonts in layout.tsx

### starting ui 
1. light ray effect using shadcn  : https://youtu.be/I1V9YWqRIeI?t=4338
npx shadcn@latest add @react-bits/LightRays-JS-CSS
2. Navbar,EventCard,Constant added.
3. pushed my code to Repo 
4. Lets jump into new branch. : git checkout -b implement-posthog
### What the hell is this PostHog 😄?
first install it pls trust me its not a virus : `npx -y @posthog/wizard@latest`


**PostHog** is a product analytics tool used to understand how users interact with your website or app.

#### ✅ What it helps with:
- 📊 Track page views and user activity
- 🖱️ Track button clicks and custom events
- 🔥 Heatmaps to see where users click and scroll
- 🎥 Session recordings to understand user behavior
- 🧭 Funnels to track user flow and conversions
- 🚩 Feature flags and A/B testing for new features


### MongoDb Setup
1. Create newProject , create new cluster , get uri , and save username and password.
2. Choose connection Method : directly Drivers, aka in our DevEvent Project itself : give URI 

3. implement-posthog brach is completed so do commit , setup stream , push and merge :    
**And Create Database-modals branch**

### Dont forget to add Ip Access 
![2026-02-17-23-52-02.png](./screenshots/2026-02-17-23-52-02.png)
by Clicking (Add IP Address)-> (Allow Acess From Anywhere )

**This make sure we can connect to our database after deployment without any issue**