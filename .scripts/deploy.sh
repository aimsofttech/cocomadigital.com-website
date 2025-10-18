#!/bin/bash
set -e

echo "Deployment started_local..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

echo "Installing Dependencies..."
npm install --yes

echo "Creating Production Build..."
# For ReactJS VueJS and Nuxt JS
npm run build

# For NextJS
# npm run export

echo "Deployment Finished!"


# #!/bin/bash
# set -e

# # Enable debugging
# set -x

# echo "Deployment started_1..."

# # Navigate to the project directory (Ensure you are in the right repo)
# cd /www/wwwroot/site.cocomadigital.com

# # Check if the current directory is a Git repository
# if [ ! -d ".git" ]; then
#     echo "Error: Not inside a Git repository."
#     exit 1
# fi

# # Print the current branch
# current_branch=$(git rev-parse --abbrev-ref HEAD)
# echo "Currently on branch: $current_branch"

# # Check if the current branch is 'main' or not, and switch to 'main' if needed
# if [ "$current_branch" != "main" ]; then
#     echo "Switching to the 'main' branch..."
#     git checkout main || git checkout -b main  # If 'main' doesn't exist, create it
# fi

# # Fetch all remote branches to ensure we have up-to-date information
# git fetch origin

# # Ensure that the remote has 'main' and pull the latest changes from 'main'
# git pull origin main || { echo "Failed to pull from 'main'"; exit 1; }

# echo "New changes copied to server!"

# echo "Installing Dependencies..."
# npm install --yes

# echo "Creating Production Build..."
# # For ReactJS, VueJS, NuxtJS
# npm run build

# # For NextJS, you can use:
# # npm run export

# echo "Deployment Finished!"
