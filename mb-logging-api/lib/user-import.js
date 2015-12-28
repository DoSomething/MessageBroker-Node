/**
 * Interface to the User model.
 */

/**
 * Constructor to the Log object.
 *
 * @param model
 *   The model of the log document.
 */
function UserImport(model) {
  this.docModel = model;
}

/**
 * Converts a timestamp in seconds to a Date object.
 *
 * @param timestamp
 *   Timestamp in seconds.
 */
var convertToDate = function(timestamp) {
  return new Date(timestamp * 1000);
};

/**
 * Create a log document from the supplied values
 *
 * Required
 * - req.query.type: [user_import] (unimplimented)
 * - req.query.exists: [1] (unimplimented)
 * - req.query.source: ['niche', 'niche.com', 'hercampus', 'att-ichannel', 'teenlife']
 * - req.query.origin: Origin file name, example: TeenLife-06-15-15.csv.
 * - req.query.processed_timestamp
 *
 * Optional (must have one of)
 * - req.body.email
 * - req.body.phone
 * - req.body.drupal_uid
 *
 * Supporting values when one of the optional values are submitted
 * - req.body.email_status
 * - req.body.email_acquired_timestamp
 * - req.body.phone_status
 * - req.body.drupal_email
 *
 * @param req
 *  The request object in a POST callback.
 * @param res
 *  The response object in a POST callback.
 */
UserImport.prototype.post = function(req, res) {
  this.request = req;
  this.response = res;
  var addArgs = {};

  // Include parameter values in post
  addArgs.source = this.request.query.source;

  var processedDate = convertToDate(parseInt(this.request.query.processed_timestamp));
  addArgs.origin = {
    "processed" : processedDate,
    "name" : this.request.query.origin,
  }

  if (this.request.body.phone !== undefined) {
    addArgs.phone = {
      "number" : this.request.body.phone,
      "status" : this.request.body.phone_status
    }
  }
  if (this.request.body.email !== undefined) {
    addArgs.email = {
      "address" : this.request.body.email,
      "status" : this.request.body.email_status
    }
    if (this.request.body.email_acquired_timestamp !== undefined) {
      var timestamp = parseInt(this.request.body.email_acquired_timestamp);
      addArgs.email.acquired = convertToDate(timestamp);
    }
  }
  if (this.request.body.drupal_uid !== undefined) {
    addArgs.drupal = {
      "email" : this.request.body.drupal_email,
      "uid" : this.request.body.drupal_uid
    }
  }
  addArgs.logged_date = new Date();

  var logEntry = new this.docModel(addArgs);
  logEntry.save(function(err) {
    if (err) {
      res.send(500, err);
      console.log("500: Internal Server Error");
      return;
    }

    // Added log entry to db
    res.status(201).json("OK");
  });
};

/**
 * Retrieve existing user log documents. Example request:
 * /api/v1/imports/2014-09-01/2014-10-01?type=user&exists=1&source=niche.com
 *
 * @param req
 *   The request object in the GET callback.
 * @param res
 *   The response object in the GET callback.
 */
UserImport.prototype.get = function(req, res) {

  if (req.param("start_date") === undefined) {
    var targetStartDate = new Date('2014-08-01');
  }
  else {
    var targetStartDate = new Date(req.param("start_date"));
  }
  if (req.param("end_date") === undefined) {
    var targetEndDate = new Date();
  }
  else {
    var targetEndDate = new Date(req.param("end_date"));
  }

  var data = {
    request: req,
    response: res
  };
  this.docModel.find( {
    $and : [
      { 'logged_date' : {$gte : targetStartDate, $lte : targetEndDate} },
      { 'source' : req.query.source },
      { 'origin.name' : req.query.origin }
    ]},
    function (err, docs) {
      if (err) {
        data.response.send(500, err);
        return;
      }

      if (docs.length == 0) {
        res.status(404).json('OK - No match found for source ' + req.query.source + ', origin ' + req.query.origin + ' logged_date: gte: ' + targetStartDate + ' lte ' + targetEndDate);
      }
      else {
        res.status(200).json(docs);
      }
  })
};

/**
 * Delete existing user log documents.
 *
 * @param req
 *   The request object in the DELETE callback.
 * @param res
 *   The response object in the DELETE callback.
 */
UserImport.prototype.delete = function(req, res) {

  this.request = req;
  this.response = res;
  var targetOrigin = this.request.query.origin;

  this.docModel.remove(
    {'origin.name': targetOrigin},
    function (err, num) {
      if (err) {
        console.log('ERROR delete: ' + err);
        res.status(500).json(err);
        return;
      }

      if (num == 0) {
        var message = 'OK - No documents found to delete for origin: ' + targetOrigin;
        res.status(404).json(message);
      }
      else {
        var message = 'OK - Deleted ' + num + ' document(s) for origin: ' + targetOrigin;
        res.status(200).json(message);
      }
    }
  );
};

module.exports = UserImport;
