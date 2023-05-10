var generalSetting = {
  firebaseConfig: function firebaseConfig() {
    return {
      apiKey: "AIzaSyAzcfKBs_ExATPPU6PmMnOpmdksZMQ5bSE",
      authDomain: "schadule-app-jquery.firebaseapp.com",
      projectId: "schadule-app-jquery",
      storageBucket: "schadule-app-jquery.appspot.com",
      messagingSenderId: "498795039698",
      appId: "1:498795039698:web:0f4b58d0a81643ad99560b"
    }
  }
}

function redirect(setUrl) {
  // For site web
  var siteUrl = window.location.origin;

  // For local site
  var localUrl = window.location.href;
  var index = localUrl.lastIndexOf('/');
  var newStr = localUrl.substring(0, index);
  var siteLocal = newStr + "/";

  window.location.href = siteLocal + setUrl;
}


function getLinkPageUrlParam(setUrl) {
  // For site web
  var siteUrl = window.location.origin;

  // For local site
  var localUrl = window.location.href;
  var index = localUrl.lastIndexOf('/');
  var newStr = localUrl.substring(0, index);
  var siteLocal = newStr + "/";

  return siteLocal + setUrl;
}

function getParameterUrlByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


var toastAction = {
  showToastAlert: function showToastAlert(toastId, title, subtitle = "", message, type) {
    var titleToast = toastId.find("#title_toast");
    var subTitleToast = toastId.find("#sub_title_toast");
    var messageToast = toastId.find("#message_toast");

    titleToast.html(title);
    subTitleToast.html(subtitle);
    messageToast.html(message);
    toastId.removeClass("bg-success");
    toastId.removeClass("bg-info");
    toastId.removeClass("bg-warning");
    toastId.removeClass("bg-danger");
    toastId.removeClass("show");
    toastId.removeClass("hide");

    var setType;
    if (type == "success") {
      setType = "bg-success";
    } else if (type == "info") {
      setType = "bg-info";
    } else if (type == "warning") {
      setType = "bg-warning";
    } else if (type == "danger") {
      setType = "bg-danger";
    };
    toastId.addClass(setType);
    toastId.addClass("show");
  },
  hideToastAlert: function hideToastAlert(toastId) {
    setTimeout(() => {
      toastId.removeClass("show");
    }, 4000);
  }
}

function generateGuid() {
  var resultGuid = "";
  var guid = 'xxxxxxxxxxxxxx4xxxxyx';
  guid.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    var result = v.toString(16);
    resultGuid += result;
  });

  return resultGuid;
}

function logOut(e, auth, signOut, onAuthStateChanged) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      redirect("auth/login.html");
    } else {
      //e.stopImmediatePropagation();
      signOut(auth).then(() => {
        redirect("auth/login.html");
      }).catch((error) => {
        console.log(error);
      });
    }
  });
}

function deleteDocumentById(id, collection) {
  const db = firebase.firestore();
  return db.collection(collection).doc(id).delete().then(function () {
    return true;
  });
}
function deleteDocCollInCollById(id1, collection1, id2, collection2) {
  const db = firebase.firestore();
  return db.collection(collection1).doc(id1).collection(collection2).doc(id2).delete().then(function () {
    return true;
  });
}

async function getUserLogin(userId) {
  const db = firebase.firestore();
  var userById = db.collection(collectionsName.users).doc(userId);
  var getUserById = await userById.get();
  var getDataUser = getUserById.data();

  return getDataUser;
}

function deleteFirestoreCollection(collectionRef) {
  var db = firebase.firestore();
  var batchSize = 50;
  var query = collectionRef.limit(batchSize);

  return query.get().then(function (snapshot) {
    // When there are no documents left, we are done
    if (snapshot.size === 0) {
      return null;
    }

    // Delete documents in batch
    var batch = db.batch();
    snapshot.docs.forEach(function (doc) {
      batch.delete(doc.ref);
    });

    // Recurse on the next batch process
    return batch.commit().then(function () {
      return deleteFirestoreCollection(collectionRef);
    });
  });
}

function getCurrentTriwulan() {
  const dt = new Date();
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();
  var monthsPerGroup = 3;
  var totalGroups = 4;

  var daysInCurrentGroup = 0;
  for (var i = 0; i < totalGroups; i++) {
    var startMonth = i * monthsPerGroup;
    var endMonth = startMonth + monthsPerGroup - 1;

    if (month >= startMonth && month <= endMonth) {
      var daysInGroup = 0;
      for (var j = startMonth; j <= endMonth; j++) {
        var firstDayOfMonth = new Date(year, j, 1);
        var firstDayOfNextMonth = new Date(year, firstDayOfMonth.getMonth() + 1, 1);
        var lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
        var daysInMonth = lastDayOfMonth.getDate();
        daysInGroup += daysInMonth;
      }

      daysInCurrentGroup = i + 1;
      break;
    }
  }

  return daysInCurrentGroup;
}

function checkMonthEndOfTriwulan() {
  var result = false;

  var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  var kelompok = [
    bulan.slice(0, 3),
    bulan.slice(3, 6),
    bulan.slice(6, 9),
    bulan.slice(9, 12)
  ];

  var sekarang = new Date();
  var bulanSekarang = bulan[sekarang.getMonth()];
  var kelompokSekarang = 0;

  for (var i = 0; i < kelompok.length; i++) {
    if (kelompok[i].indexOf(bulanSekarang) !== -1) {
      kelompokSekarang = i + 1;
      break;
    }
  }
  
  if (kelompokSekarang !== 0 && kelompok[kelompokSekarang - 1][2] === bulanSekarang) {
    result = true;
  }

  return result;
}