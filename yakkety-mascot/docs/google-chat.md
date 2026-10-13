# Setting Yakkety's avatar in Google Chat

Google Chat shows Yakkety's avatar in two places, and you set it differently in each:

- **Incoming webhooks:** messages posted into a space by a script.
- **Chat apps:** Yakkety as an app people can message or add to spaces, configured in Google Cloud.

Both need the same thing first: a **public HTTPS link to a square PNG or JPEG, at least 256×256**. Use `yakkety-avatar-512.png`. Google Chat crops it to a circle, and the art leaves room for that.

## Step 1: Get a public link to the avatar

Google's servers fetch the image themselves, so the link must open without signing in. A link into this repo only works if the repo is public; while it is private, GitHub returns "Not found" to Google.

**Option A: make this repo public (recommended).** It holds only brand art, guidelines and research, with no member data.
1. On GitHub, open **ncssm-yac/design-system → Settings → General**.
2. Under **Danger Zone**, click **Change visibility → Make public**, and confirm.
3. The avatar link is then:
   ```
   https://raw.githubusercontent.com/ncssm-yac/design-system/main/yakkety-mascot/avatar/yakkety-avatar-512.png
   ```
4. Paste the link into a private (incognito) browser window. You should see the yak, not a GitHub page or an error.

**Option B: keep the repo private and use Google Drive.**
1. Upload `yakkety-avatar-512.png` to the YAC shared drive.
2. Use **Share → General access → Anyone with the link → Viewer**. Your NCSSM Workspace may not allow this; if the option is greyed out, use option A.
3. Copy the file ID: the long part of the share link between `/d/` and `/view`.
4. Your avatar link is `https://lh3.googleusercontent.com/d/FILE_ID`. Test it in an incognito window as above. Google doesn't officially support this link format, so it can stop working; option A is more reliable.

Don't move or rename the file after setting it up. Chat keeps loading the image from the link.

## Step 2a: Incoming webhooks

The avatar belongs to the webhook and is set when the webhook is created. You need to be able to manage apps in the space.

1. In Google Chat, open the space and click the **space name** at the top, then **Apps & integrations**.
2. Under **Webhooks**, click **Manage webhooks**, or **Add webhooks** if there are none yet.
3. **If your existing webhook has an edit (pencil) option:** change **Avatar URL** to the link from step 1, set **Name** to `Yakkety`, and save. You're done; the next message shows the new avatar.
4. **If it can't be edited:**
   1. Click **Add another**, set **Name** to `Yakkety` and **Avatar URL** to the link from step 1, then **Save**.
   2. Open the new webhook's **More (⋮)** menu and choose **Copy link**.
   3. Wherever the old webhook URL is stored (a script's properties, a secrets manager or an environment variable), replace it with the new URL.
   4. Send a test message and check it shows the yak. Then delete the old webhook from **Manage webhooks**.
5. Repeat for each space Yakkety posts to.

Treat webhook URLs like passwords: anyone with one can post into the space. Keep them out of GitHub, docs and chat messages.

**Inside messages:** if a script sends card messages (`cardsV2`), the card header can also show the avatar. Set `header.imageUrl` to the same link and `header.imageType` to `CIRCLE`.

## Step 2b: A Chat app in Google Cloud

You need access to the Google Cloud project that hosts the Yakkety Chat app.

1. Go to **console.cloud.google.com** and select the project.
2. Open **APIs & Services → Enabled APIs & services → Google Chat API → Configuration**.
3. Under **Application info**:
   - **App name:** `Yakkety` (up to 25 characters)
   - **Avatar URL:** the link from step 1
   - **Description:** for example, `YAC's AI Secretary` (up to 40 characters)
4. Click **Save**.

It can take some time for the new avatar to reach everyone; Chat caches images. Signing out and back in, or opening Chat in an incognito window, shows it sooner.

## Checklist

- [ ] The avatar link opens in an incognito window and shows the yak
- [ ] Every webhook Yakkety posts through is named `Yakkety` and uses the link
- [ ] Old webhooks are deleted, and their URLs are no longer stored anywhere
- [ ] The Chat app (if any) has the new name, avatar and description
- [ ] A test message in each space shows the yak
