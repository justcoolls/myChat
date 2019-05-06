const Service = {
    groupMember: (data) => {
        return fetch("/group/groupMember", {
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