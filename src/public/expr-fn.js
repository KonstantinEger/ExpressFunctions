window.exprfn = {};

function _connect() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/_exprfn/connect');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        console.log('Express Functions: ' + resp.msg);
        window.exprfn._fnurl = '/_exprfn/fn';
        resolve({
          call: _callRequest
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
        // console.log(resp.errMsg);
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

window.exprfn.connect = _connect;