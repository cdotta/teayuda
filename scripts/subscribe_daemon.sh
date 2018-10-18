#!/usr/bin/env bash

curl -v $1:1026/v2/subscriptions?limit=500 -s -S -H 'Content-Type: application/json' -d @- <<EOF
{
  "description": "Get info about all the buses",
  "subject": {
    "entities": [
      {
        "idPattern": ".*",
        "type": "Bus"
      }
    ]
  },
  "notification": {
    "http": {
      "url": "http://$2:1028/accumulate"
    }
  },
  "expires": "2040-01-01T14:00:00.00Z",
  "throttling": 15
}
EOF
