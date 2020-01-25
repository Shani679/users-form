import React, {useState, useEffect, useRef} from 'react';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

export const Input = ({name, placeholder, error, onChange, defaultValue}) => {

    const [value, setValue] = useState(defaultValue);
    const prevDefaultValue = usePrevious(defaultValue);

    useEffect(() => {
        if(prevDefaultValue !== defaultValue){
            return setValue(defaultValue)
        }
        return onChange(name, value)
    }, [value, defaultValue]);

    const onChangeHandler = value => {
        setValue(value)
    }
    return (
        <div>
            <input type="text" placeholder={placeholder} name={name} value={value} onChange={e => onChangeHandler(e.target.value)}/>
            {error && <p>{error}</p>}
        </div>
    )
}