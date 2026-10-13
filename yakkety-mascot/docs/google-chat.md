# Setting Yakkety's avatar in Google Chat

Google Chat shows Yakkety's avatar in two places, and you set it differently in each:

- **Incoming webhooks:** messages posted into a space by a script.
- **Chat apps:** Yakkety as an app people can message or add to spaces, configured in Google Cloud.

Both need the same thing first: a **public HTTPS link to a square PNG or JPEG, at least 256×256**. Use `yakkety-avatar-512.png`. Google Chat crops it to a circle, and the art leaves room for that.

## Step 1: The avatar link

This repo is public, so Google can load the avatar straight from GitHub:

```
https://raw.githubusercontent.com/ncssm-yac/design-system/main/yakkety-mascot/avatar/yakkety-avatar-512.png
```

To check it, open the link in an incognito window; you should see the yak on its own. The link keeps working as long as the repo stays public and the file isn't moved or renamed. If the repo is ever made private again, every Yakkety avatar in Chat breaks, so move the image somewhere public first.

## Step 2a: Incoming webhooks

Today, Yakkety's Chat posts come from **Yakkety Notes** (`ncssm-yac/yac-meeting-notes-relocator`), through one webhook in each of four spaces: **YAC General**, **YAC Leadership**, **YAC Exec** and **YAC IT**. The avatar belongs to each webhook. Editing a webhook's name or avatar doesn't change its link, so no script properties or hosts need updating.

You need to be able to manage apps in each space. For each of the four spaces:

1. In Google Chat, open the space and click the **space name** at the top, then **Apps & integrations**.
2. Under **Webhooks**, click **Manage webhooks**.
3. Next to the `Yakkety` webhook, click the edit (pencil) icon.
4. Replace **Avatar URL** with the link from step 1, keep **Name** as `Yakkety`, and click **Save**.

Don't delete and re-create a webhook: that changes its link, and every host's Script Property would need updating.

To check: in the Apps Script project, run `testChatNotify`. Each space gets a hello from Yakkety, which should now show the yak.

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
