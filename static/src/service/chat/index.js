const Service = {
    groupList: () => {
        return fetch("/groupList", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            return data;
        }).catch(err => console.log(err));
    },
    getMessageList: (data) => {
        return fetch("/myChat/messageList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            return data;
        }).catch(err => console.log(err));
    },
    getInformation: () => {
        return fetch("/information", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            return data;
        }).catch(err => console.log(err));
    },
    createGroup: (data) => {
        return fetch("/group/createGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            return data;
        }).catch(err => console.log(err));
    },
    addGroup: (data) => {
        return fetch("/group/addGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            return data;
        }).catch(err => console.log(err));
    },

};
export default Service;