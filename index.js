const core = require("@actions/core");
const github = require("@actions/github");
/**
 * Adds reviewers to a pull request.
 *
 * Uses octokit to access GitHub Actions information to add a reviewer
 * or list of reviewers to the pull request the action executed on.
 *
 * @since 1.0.0
 */
async function run() {
  try {
    const reviewers = core.getInput("reviewers");
    const removeRequest = core.getInput("remove").toLowerCase() === "true";
    const prReviewers = reviewers.split(", ");
    const token = process.env["GITHUB_TOKEN"] || core.getInput("token");
    const octokit = github.getOctokit(token);
    const context = github.context;

    const { name, owner } = context.payload.repository
    
    console.log(context.payload.repository)
    return
    const { data: reviewersData } = await octokit.pulls.listReviews({
        owner: 'holding-digital',
        repo: 'livia-app',
        pull_number: 1404,
    });
    
    if(reviewersData.length){
      for (let i = 0; i < reviewersData.length; i++) {
        const reviewer = reviewersData[i].user;
        const removeReviewer = prReviewers.indexOf(reviewer.login)
        if(removeReviewer > -1){
          prReviewers.splice(removeReviewer, 1);
        }
      }
    }
    

    return

    if (context.payload.pull_request == null) {
      core.setFailed("No pull request found.");
      return;
    }
    const pullRequestOwner = context.payload.pull_request.user.login;
    const ownerIndex = prReviewers.indexOf(pullRequestOwner)
    if(ownerIndex > -1){
      prReviewers.splice(ownerIndex, 1);
    }
    const pullRequestNumber = context.payload.pull_request.number;
    const params = {
      ...context.repo,
      pull_number: pullRequestNumber,
      reviewers: prReviewers,
    };

    if (removeRequest) {
      octokit.pulls.removeRequestedReviewers(params);
    } else {
      octokit.pulls.requestReviewers(params);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
