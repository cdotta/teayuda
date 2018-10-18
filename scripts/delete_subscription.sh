#!/usr/bin/env bash

curl --request DELETE --url http://$1:1026/v2/subscriptions/$2
