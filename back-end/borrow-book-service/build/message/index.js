const MESSAGE_SUCCESS = (res, status, data) => {
  if (status === 'OK') {
    res.status(200).json({
      status: 'success',
      data: data
    });
  }
  //  else if (status === 'error') {
  //     res.status(500).json({ status: 'error', data: data });
  // } else {
  //     res.status(400).json({ status: 'error', message: 'Invalid status' });
  // }
};
const MESSAGE_ERROR = (res, status, errMessage) => {
  if (status === 'ERR') {
    res.status(400).json({
      status: 'error',
      error: errMessage
    });
  }
  //  else if (status === 'error') {
  //     res.status(500).json({ status: 'error', message: data });
  // } else {
  //     res.status(400).json({ status: 'error', message: 'Invalid status' });
  // }
};
export default {
  MESSAGE_SUCCESS,
  MESSAGE_ERROR
};