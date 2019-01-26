window.exprfn = {};

function _connect(domain = '') {
  const adress = domain + '/_exprfn/connect';
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', adress);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        console.log('Express Functions: ' + resp.msg);
        window.exprfn._fnurl = domain + '/_exprfn/fn';
        window.exprfn._eventurl = domain + '/_exprfn/event';
        resolve({
          call: _callRequest,
          on: _onRequest
        });
      }
    };
    xhr.send();
  })
}

function _callRequest(fnName, params) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', window.exprfn._fnurl);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        if (resp.status === 'DONE') {
          resolve(resp.result);
        } else if (resp.status === 'ERR' && resp.errCode === '01') {
          reject(resp.msg);
        } else if (resp.status === 'ERR' && resp.errCode === '02') {
          reject(resp.msg);
          console.error(resp.errMsg);
        }
      }
    };
    xhr.send(JSON.stringify({
      fnName,
      params
    }));
  });
}

function _onRequest(eventName) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', window.exprfn._eventurl + '/on');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        resolve(resp.data);
      }
    }
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify({
      event: eventName
    }));
  });
}

window.exprfn.connect = _connect;