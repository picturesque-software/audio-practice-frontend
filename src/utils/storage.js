const storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        return localStorage.getItem(key)?localStorage.getItem(key).replace('"','').replace('"',''):"";
    },
    getObj(key) {
        return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):null;
    },
    remove(key) {
        localStorage.removeItem(key);
    }
}

Storage.prototype.setStorageWithAge = (key, value, age) => {
    if (isNaN(age) || age < 1) throw new Error("age must be a number");
    const obj = {
        data: value, //�洢ֵ
        time: Date.now(), //��ֵʱ���
        maxAge: age, //����ʱ��
    };
    localStorage.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getStorageWithAge = key => {
    console.log(localStorage.getItem(key))
    if(localStorage.getItem(key)===null) return null
    const { data, time, maxAge } = JSON.parse(localStorage.getItem(key));
    if (time + maxAge < Date.now()) {
        localStorage.removeItem(key);
        return undefined;
    }
    return data;
};

export default storage;
