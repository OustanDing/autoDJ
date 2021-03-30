const express = require('express')

const { getCurrentMetrics } = require('./utils')

const router = express.Router()

router.get('/getCurrentMetrics', async (req, res) => {
  const metrics = await getCurrentMetrics()
  res.status(200).send(metrics)
})

module.exports = router
