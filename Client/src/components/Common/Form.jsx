import React from 'react'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'

function Form({ getItems, btnText = "Submit", chkBox = false, chkText ="", localData, setLocalData, onSubmit }) {

  return (
    <> 
    
      <form className="space-y-4" onSubmit={onSubmit}> 
        {
          getItems.map((item, index) => (
            <div key={index}>
              <label htmlFor={item.name} className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>

              <Input
                type={item.type}
                name={item.name}
                autoComplete={item.name === "password"? "off" : item.name}
                id={item.name} 
                placeholder={item.placeholder}
                required={item.required}
                value={localData[item.name] || ""}
                onChange={(e) => {
                  setLocalData({
                    ...localData,
                    [item.name]: e.target.value
                  })
                }}
              />
            </div>
          )
          )}


        <div className={`${chkBox ? 'flex' : 'hidden'} my-5 items-center`}>
          <label className="flex items-center pr-1" htmlFor='chkbox'>
           <Checkbox autoComplete='off' id='chkbox' className={'data-[state=checked]:bg-green-700'} />
            <span className="ml-2 text-sm text-gray-600">{chkText}</span>
          </label>
        </div>

        <button type='submit' className={`${chkBox ? 'mt-0' : 'mt-10'} w-full bg-green-700 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors`}>
          {btnText}
        </button>
      </form>
    </>
  )
}

export default Form
