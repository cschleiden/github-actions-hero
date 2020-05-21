export function getEventPayload(event: string) {
  switch (event) {
    case "push":
      return {
        after: "825e127fcace28992b3688a96f78fe4d55e1e145",
        base_ref: null,
        before: "0fdec3fd798d4a239fc431deac223cc4196c50c3",
        commits: [
          {
            author: {
              email: "cschleiden@github.com",
              name: "Christopher Schleiden",
              username: "cschleiden",
            },
            committer: {
              email: "noreply@github.com",
              name: "GitHub",
              username: "web-flow",
            },
            distinct: true,
            id: "825e127fcace28992b3688a96f78fe4d55e1e145",
            message: "Update new-schedule.yaml",
            timestamp: "2020-04-01T16:27:08-07:00",
            tree_id: "8f2e4ae43054c6d9cab914ea0b8e1ced9559c4ab",
            url:
              "https://github.com/myorg/cschleiden-test/commit/825e127fcace28992b3688a96f78fe4d55e1e145",
          },
        ],
        compare:
          "https://github.com/myorg/cschleiden-test/compare/0fdec3fd798d...825e127fcace",
        created: false,
        deleted: false,
        forced: false,
        head_commit: {
          author: {
            email: "cschleiden@github.com",
            name: "Christopher Schleiden",
            username: "cschleiden",
          },
          committer: {
            email: "noreply@github.com",
            name: "GitHub",
            username: "web-flow",
          },
          distinct: true,
          id: "825e127fcace28992b3688a96f78fe4d55e1e145",
          message: "Update new-schedule.yaml",
          timestamp: "2020-04-01T16:27:08-07:00",
          tree_id: "8f2e4ae43054c6d9cab914ea0b8e1ced9559c4ab",
          url:
            "https://github.com/myorg/cschleiden-test/commit/825e127fcace28992b3688a96f78fe4d55e1e145",
        },
        organization: {
          avatar_url: "https://avatars1.githubusercontent.com/u/33435682?v=4",
          description: '"Some org!"',
          events_url: "https://api.github.com/orgs/myorg/events",
          hooks_url: "https://api.github.com/orgs/myorg/hooks",
          id: 33435682,
          issues_url: "https://api.github.com/orgs/myorg/issues",
          login: "myorg",
          members_url: "https://api.github.com/orgs/myorg/members{/member}",
          node_id: "MDEyOk9yZ2FuaXphdGlvbjMzNDM1Njgy",
          public_members_url:
            "https://api.github.com/orgs/myorg/public_members{/member}",
          repos_url: "https://api.github.com/orgs/myorg/repos",
          url: "https://api.github.com/orgs/myorg",
        },
        pusher: {
          email: "cschleiden@live.de",
          name: "cschleiden",
        },
        ref: "refs/heads/master",
        repository: {
          archive_url:
            "https://api.github.com/repos/myorg/cschleiden-test/{archive_format}{/ref}",
          archived: false,
          assignees_url:
            "https://api.github.com/repos/myorg/cschleiden-test/assignees{/user}",
          blobs_url:
            "https://api.github.com/repos/myorg/cschleiden-test/git/blobs{/sha}",
          branches_url:
            "https://api.github.com/repos/myorg/cschleiden-test/branches{/branch}",
          clone_url: "https://github.com/myorg/cschleiden-test.git",
          collaborators_url:
            "https://api.github.com/repos/myorg/cschleiden-test/collaborators{/collaborator}",
          comments_url:
            "https://api.github.com/repos/myorg/cschleiden-test/comments{/number}",
          commits_url:
            "https://api.github.com/repos/myorg/cschleiden-test/commits{/sha}",
          compare_url:
            "https://api.github.com/repos/myorg/cschleiden-test/compare/{base}...{head}",
          contents_url:
            "https://api.github.com/repos/myorg/cschleiden-test/contents/{+path}",
          contributors_url:
            "https://api.github.com/repos/myorg/cschleiden-test/contributors",
          created_at: 1570143203,
          default_branch: "master",
          deployments_url:
            "https://api.github.com/repos/myorg/cschleiden-test/deployments",
          description: null,
          disabled: false,
          downloads_url:
            "https://api.github.com/repos/myorg/cschleiden-test/downloads",
          events_url:
            "https://api.github.com/repos/myorg/cschleiden-test/events",
          fork: false,
          forks: 0,
          forks_count: 0,
          forks_url: "https://api.github.com/repos/myorg/cschleiden-test/forks",
          full_name: "myorg/cschleiden-test",
          git_commits_url:
            "https://api.github.com/repos/myorg/cschleiden-test/git/commits{/sha}",
          git_refs_url:
            "https://api.github.com/repos/myorg/cschleiden-test/git/refs{/sha}",
          git_tags_url:
            "https://api.github.com/repos/myorg/cschleiden-test/git/tags{/sha}",
          git_url: "git://github.com/myorg/cschleiden-test.git",
          has_downloads: true,
          has_issues: true,
          has_pages: false,
          has_projects: true,
          has_wiki: true,
          homepage: null,
          hooks_url: "https://api.github.com/repos/myorg/cschleiden-test/hooks",
          html_url: "https://github.com/myorg/cschleiden-test",
          id: 212695793,
          issue_comment_url:
            "https://api.github.com/repos/myorg/cschleiden-test/issues/comments{/number}",
          issue_events_url:
            "https://api.github.com/repos/myorg/cschleiden-test/issues/events{/number}",
          issues_url:
            "https://api.github.com/repos/myorg/cschleiden-test/issues{/number}",
          keys_url:
            "https://api.github.com/repos/myorg/cschleiden-test/keys{/key_id}",
          labels_url:
            "https://api.github.com/repos/myorg/cschleiden-test/labels{/name}",
          language: null,
          languages_url:
            "https://api.github.com/repos/myorg/cschleiden-test/languages",
          license: null,
          master_branch: "master",
          merges_url:
            "https://api.github.com/repos/myorg/cschleiden-test/merges",
          milestones_url:
            "https://api.github.com/repos/myorg/cschleiden-test/milestones{/number}",
          mirror_url: null,
          name: "cschleiden-test",
          node_id: "MDEwOlJlcG9zaXRvcnkyMTI2OTU3OTM=",
          notifications_url:
            "https://api.github.com/repos/myorg/cschleiden-test/notifications{?since,all,participating}",
          open_issues: 12,
          open_issues_count: 12,
          organization: "myorg",
          owner: {
            avatar_url: "https://avatars1.githubusercontent.com/u/33435682?v=4",
            email: null,
            events_url: "https://api.github.com/users/myorg/events{/privacy}",
            followers_url: "https://api.github.com/users/myorg/followers",
            following_url:
              "https://api.github.com/users/myorg/following{/other_user}",
            gists_url: "https://api.github.com/users/myorg/gists{/gist_id}",
            gravatar_id: "",
            html_url: "https://github.com/myorg",
            id: 33435682,
            login: "myorg",
            name: "myorg",
            node_id: "MDEyOk9yZ2FuaXphdGlvbjMzNDM1Njgy",
            organizations_url: "https://api.github.com/users/myorg/orgs",
            received_events_url:
              "https://api.github.com/users/myorg/received_events",
            repos_url: "https://api.github.com/users/myorg/repos",
            site_admin: false,
            starred_url:
              "https://api.github.com/users/myorg/starred{/owner}{/repo}",
            subscriptions_url:
              "https://api.github.com/users/myorg/subscriptions",
            type: "Organization",
            url: "https://api.github.com/users/myorg",
          },
          private: true,
          pulls_url:
            "https://api.github.com/repos/myorg/cschleiden-test/pulls{/number}",
          pushed_at: 1585783628,
          releases_url:
            "https://api.github.com/repos/myorg/cschleiden-test/releases{/id}",
          size: 153,
          ssh_url: "git@github.com:myorg/cschleiden-test.git",
          stargazers: 0,
          stargazers_count: 0,
          stargazers_url:
            "https://api.github.com/repos/myorg/cschleiden-test/stargazers",
          statuses_url:
            "https://api.github.com/repos/myorg/cschleiden-test/statuses/{sha}",
          subscribers_url:
            "https://api.github.com/repos/myorg/cschleiden-test/subscribers",
          subscription_url:
            "https://api.github.com/repos/myorg/cschleiden-test/subscription",
          svn_url: "https://github.com/myorg/cschleiden-test",
          tags_url: "https://api.github.com/repos/myorg/cschleiden-test/tags",
          teams_url: "https://api.github.com/repos/myorg/cschleiden-test/teams",
          trees_url:
            "https://api.github.com/repos/myorg/cschleiden-test/git/trees{/sha}",
          updated_at: "2020-04-01T23:26:34Z",
          url: "https://github.com/myorg/cschleiden-test",
          watchers: 0,
          watchers_count: 0,
        },
        sender: {
          avatar_url: "https://avatars2.githubusercontent.com/u/2201819?v=4",
          events_url:
            "https://api.github.com/users/cschleiden/events{/privacy}",
          followers_url: "https://api.github.com/users/cschleiden/followers",
          following_url:
            "https://api.github.com/users/cschleiden/following{/other_user}",
          gists_url: "https://api.github.com/users/cschleiden/gists{/gist_id}",
          gravatar_id: "",
          html_url: "https://github.com/cschleiden",
          id: 2201819,
          login: "cschleiden",
          node_id: "MDQ6VXNlcjIyMDE4MTk=",
          organizations_url: "https://api.github.com/users/cschleiden/orgs",
          received_events_url:
            "https://api.github.com/users/cschleiden/received_events",
          repos_url: "https://api.github.com/users/cschleiden/repos",
          site_admin: true,
          starred_url:
            "https://api.github.com/users/cschleiden/starred{/owner}{/repo}",
          subscriptions_url:
            "https://api.github.com/users/cschleiden/subscriptions",
          type: "User",
          url: "https://api.github.com/users/cschleiden",
        },
      };
  }

  return {};
}