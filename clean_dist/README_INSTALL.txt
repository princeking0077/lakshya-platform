STOP! READ THIS FIRST.

This is the COMPLETE, CLEAN installer for your Enlighten Pharma Website.
Follow these steps EXACTLY to fix everything.

-------------------------------------------------------------------------
STEP 1: CLEAN UP HOSTINGER (FILE MANAGER)
-------------------------------------------------------------------------
1. Go to your Hostinger File Manager inside 'public_html'.
2. SELECT ALL files and folders inside 'public_html'.
3. CLICK DELETE. (Yes, delete everything. We are starting fresh).
   (Note: If you have other websites in subfolders, don't delete them. But for this site, clear it).

-------------------------------------------------------------------------
STEP 2: UPLOAD THIS PACKAGE
-------------------------------------------------------------------------
1. You have a ZIP file called 'ENLIGHTEN_PHARMA_FULL_DEPLOY.zip'.
2. Upload this ZIP file to 'public_html'.
3. Right-Click the ZIP -> Extract -> Extract Here (dot .).

-------------------------------------------------------------------------
STEP 3: CONNECT DATABASE (CRITICAL)
-------------------------------------------------------------------------
1. Go to folder: public_html -> config
2. Right-Click 'db.php' -> Edit.
3. Change the $password = '...' to your REAL Database Password.
   (The one you created in Hostinger Dashboard).
4. Save & Close.

-------------------------------------------------------------------------
STEP 4: SETUP ADMIN ACCOUNT
-------------------------------------------------------------------------
1. Open your browser to: https://enlightenpharma.in/super_rescue.php
2. It should show a GREEN message: "Database Connected".
3. It will Create/Reset the Admin Account (admin@example.com / admin123).

-------------------------------------------------------------------------
STEP 5: TEST
-------------------------------------------------------------------------
1. Go to https://enlightenpharma.in/login
2. Login with: admin@example.com / admin123
3. It should redirect you to the Admin Dashboard properly.

-------------------------------------------------------------------------
STEP 6: STUDENT TEST
-------------------------------------------------------------------------
1. Logout.
2. Click Register.
3. Create a new account.
4. It should redirect you to the Student Dashboard.

YOU ARE DONE!
If you see unnecessary files later (like super_rescue.php), you can delete them.
But DO NOT delete the 'api' folder or '.htaccess'.
