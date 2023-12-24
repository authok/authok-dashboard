export default {
  "type": "object",
  "properties": {
    "app_id": {
      "x-component": "Input",
      "title": "App ID",
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "rules": [
          {
            "required": true,
            "message": "此项为必填项",
          }
        ],
        "extra": "{{link('如何获取App ID', 'http://www.baidu.com')}}",
      }
    },
    "app_secret": {
      "x-component": "Input",
      "title": "App Secret",
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "rules": [
          {
            "required": true,
            "message": "此项为必填项"
          }
        ],
        "extra": "For security purposes, we don’t show your existing App Secret.",
      }
    },
    "user_data": {
      "type": "void",
      "x-component": "FormGrid",
      "x-component-props": {
        maxColumns: [2, 3, 4],
      },
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "label": "User Data",
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical"
      },
      properties: {
        "scopes.ads_management": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Ads Management",
              "value": "ads_management",
              "tooltip": "MuiButtonBase-root MuiIconButton-root jss287 MuiCheckbox-root MuiCheckbox-colorPrimary jss273 MuiIconButton-colorPrimary"
            }
          }
        },
        "scopes.ads_read": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Ads Read",
              "value": "ads_read",
              "tooltip": "Grants your app access to the Ads Insights API to pull ads report information for ad accounts you own or have been granted access to by the owner or owners of other ad accounts through this permission."
            }
          }
        },
        "scopes.business_management": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Business Management",
              "value": "business_management",
              "tooltip": "Grants your app permission to read and write with the Business Manager API."
            }
          }
        },
        "scopes.leads_retrieval": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Leads Retrieval",
              "value": "leads_retrieval",
              "tooltip": "Grants your app permission to retrieve all the information captured within a lead."
            }
          }
        },
        "scopes.manage_pages": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Manage Pages",
              "value": "manage_pages",
              "tooltip": "Grants an app permission to retrieve Page Access Tokens for the Pages and Apps that the person administers. Apps need both manage_pages and publish_pages to be able to publish as a Page."
            }
          }
        },
        "scopes.manage_pages": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Pages Manage CTA",
              "value": "pages_manage_cta",
              "tooltip": "Allows app to perform POST and DELETE operations on endpoints used for managing a Page's Call To Action buttons."
            }
          }
        },
        "scopes.pages_manage_instant_articles": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Pages Manage Instant Articles",
              "value": "pages_manage_instant_articles",
              "tooltip": "Grants an app permission to manage Instant Articles on behalf of Facebook Pages administered by people using your app."
            }
          }
        },
        "scopes.pages_show_list": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Pages Show List",
              "value": "pages_show_list",
              "tooltip": "Grants your app access to show the list of the Pages that a person manages."
            }
          }
        },
        "scopes.pages_messaging": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Pages Messaging",
              "value": "pages_messaging",
              "tooltip": "Grants your app permission to send and receive messages through a Facebook Page."
            }
          }
        },
        "scopes.pages_messaging_phone_number": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Pages Messaging Phone Number",
              "value": "pages_messaging_phone_number",
              "tooltip": "Grants your app permission to use the phone number messaging feature."
            }
          }
        },
        "scopes.pages_messaging_subscriptions": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Pages Messaging Subscriptions",
              "value": "pages_messaging_subscriptions",
              "tooltip": "Grants your app permission to send messages using Facebook Pages at any time after the first user interaction. Your app may only send advertising or promotional content through sponsored messages or within 24 hours of user interaction."
            }
          }
        },
        "scopes.publish_pages": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Publish Pages",
              "value": "publish_pages",
              "tooltip": "Grants your app permission to publish posts, comments, and like Pages managed by a person using your app. Your app must also have manage_pages to publish as a Page."
            }
          }
        },
        "scopes.publish_to_groups": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Publish to Groups",
              "value": "publish_to_groups",
              "tooltip": "Grants an app permission to post content into a group on behalf of a User who has granted the app this permission."
            }
          }
        },
        "scopes.publish_video": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Publish Videos",
              "value": "publish_video",
              "tooltip": "Grants an app permission to publish live videos to the app User's timeline."
            }
          }
        },
        "scopes.read_audience_network_insights": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Read Audience Network Insights",
              "value": "read_audience_network_insights",
              "tooltip": "Grants an app permission to read-only access of the Audience Network Insights data for Apps the person owns."
            }
          }
        },
        "scopes.read_insights": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Read Insights",
              "value": "read_insights",
              "tooltip": "Grants an app permissions to read-only access of the Insights data for Pages, Apps, and web domains the person owns."
            }
          }
        },
        "scopes.read_page_mailboxes": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Read Page Mailboxes",
              "value": "read_page_mailboxes",
              "tooltip": "Grants an app permission to read from the Page Inboxes of the Pages managed by a person. This permission is often used alongside the manage_pages permission."
            }
          }
        }
      }
    },
    "permissions": {
      "type": "void",
      "title": "",
      "x-component": "FormGrid",
      "x-component-props": {
        maxColumns: [2, 3, 4],
      },
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "label": "Permissions",
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical"
      },
      properties: {
       "scopes.public_profile": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Public Profile",
              "value": "public_profile",
              "tooltip": "Facebook will show this consent message: \"App would like to access your public profile\". This is the most basic permission and Auth0 will pass through all these attributes: id, first_name, last_name, middle_name, name, name_format, picture, short_name."
            }
          }
        },
        "scopes.email": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Email",
              "value": "email",
              "tooltip": "Grants your app permission to access a person's primary email address."
            }
          }
        },
        "scopes.groups_access_member_info": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Group Access Member Info",
              "value": "groups_access_member_info",
              "tooltip": "Grants an app permission to publicly available group member information."
            }
          }
        },
        "scopes.publish_to_groups": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Publish to Groups",
              "value": "publish_to_groups",
              "tooltip": "Grants an app permission to post content into a group on behalf of a User who has granted the app this permission."
            }
          }
        },
        "scopes.user_age_range": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Age Range",
              "value": "user_age_range",
              "tooltip": "Grants an app permission to access a person's age range."
            }
          }
        },
        "scopes.user_birthday": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Birthday",
              "value": "user_birthday",
              "tooltip": "Grants an app permission to access a person's birthday."
            }
          }
        },
        "scopes.user_events": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Events",
              "value": "user_events",
              "tooltip": "Grants an app permissions to read-only access to the Events a person is a host of or has RSVPed to. This permission is restricted to a limited set of partners and usage requires prior approval by Facebook."
            }
          }
        },
        "scopes.user_friends": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Friends",
              "value": "user_friends",
              "tooltip": "Grants an app permission to access a list of friends that also use said app. This permission is restricted to a limited set of partners and usage requires prior approval by Facebook."
            }
          }
        },
        "scopes.user_gender": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Gender",
              "value": "user_gender",
              "tooltip": "Grants an app permission to access a person's gender."
            }
          }
        },
        "scopes.user_hometown": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Hometown",
              "value": "user_hometown",
              "tooltip": "Grants an app permission to access a person's hometown location set in their User Profile."
            }
          }
        },
        "scopes.user_likes": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Likes",
              "value": "user_likes",
              "tooltip": "Grants an app permission to access the list of all Facebook Pages that a person has liked."
            }
          }
        },
        "scopes.user_link": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Profile URL",
              "value": "user_link",
              "tooltip": "Grants your app permission to access the Facebook Profile URL of User of your app."
            }
          }
        },
        "scopes.user_location": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Location",
              "value": "user_location",
              "tooltip": "Provides access to a person's current city through the location field on the User object. The current city is set by a person on their Profile."
            }
          }
        },
        "scopes.user_photos": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Photos",
              "value": "user_photos",
              "tooltip": "Provides access to the photos a person has uploaded or been tagged in. This is available through the photos edge on the User object. This permission is restricted to a limited set of partners and usage requires prior approval by Facebook."
            }
          }
        },
        "scopes.user_posts": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Posts",
              "value": "user_posts",
              "tooltip": "Provides access to the posts on a person's Timeline. Includes their own posts, posts they are tagged in, and posts other people make on their Timeline. This permission is restricted to a limited set of partners and usage requires prior approval by Facebook."
            }
          }
        },
        "scopes.user_tagged_places": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Tagged Places",
              "value": "user_tagged_places",
              "tooltip": "Provides access to the Places a person has been tagged at in photos, videos, statuses and links. This permission is restricted to a limited set of partners and usage requires prior approval by Facebook."
            }
          }
        },
        "scopes.user_videos": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Videos",
              "value": "user_videos",
              "tooltip": "Provides access to the videos a person has uploaded or been tagged in. This permission is restricted to a limited set of partners and usage requires prior approval by Facebook."
            }
          }
        }
      }
    }
  }
};