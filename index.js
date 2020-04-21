"use strict"

const express = require("express"),
  bodyParser = require("body-parser"),
  app = express().use(bodyParser.json())

// Adds support for GET requests to webhook
app.get("/webhook", (req, res) => {
  // My verify token. Should be a random string.
  let VERIFY_TOKEN = "255036688965769|i6btMxz1x13iGj3uWXj-dvw0olM"
  // Page Access Token:   EAADn9FtAIIkBAH4Kzj9ZAKTTOsruZAJVwO28ZBdregV473IzCOj3IlZAShBpANqohzdvUNBZC4g0pysVx2qP5ZCZBVs2Eut6KSEYYJZBHamPf9RF7GBfvUKVSmlICJtGUPHs0mW2v45Uk1VTro0MAZCD6aXPxu4kq1w7MZCymRv1wfrV0sNL5SpsMZClX3n0EBQSZAUZD

  // Parse the query params
  let mode = req.query["hub.mode"]
  let token = req.query["hub.verify_token"]
  let challenge = req.query["hub.challenge"]

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED")
      res.status(200).send(challenge)
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
})

// Creates the endpoint for the webhook
app.post("/webhook", (req, res) => {
  let reqBody = req.body

  // Check this is an event from a page subscription
  if (reqBody.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    reqBody.entry.forEach((entry) => {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)
    })

    // Returns a '200 OK' response to all requests
    // Won't send before solve the event completely
    res.status(200).send("EVENT_RECEIVED")
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
})

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"))
