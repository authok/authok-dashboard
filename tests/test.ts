


const extractProps = (obj1: {}, obj2: {}) => {
    const res = {}
    const key1 = Object.keys(obj1);
    const key2 = Object.keys(obj2);

    const commonKeys = key1.filter(el => key2.includes(el))
    console.log('commonKeys', commonKeys)
    commonKeys.forEach(key => { res[key] = obj2[key] })
    return res
}


const obj1 = {
    a?: '1',
    b?: '2',
    c: '3'
}
const obj2 = {
    a: '11',
    b: '22',
    d: '44'
}

// console.log(extractProps(obj1, obj2))

// export default extractProps;

const subset = Object.keys(obj1)
    .filter(key => ['a', 'b'].indexOf(key) >= 0)
    .reduce((obj3, key) => Object.assign(obj3, { [key]: obj1[key] }), {});

console.log(subset)