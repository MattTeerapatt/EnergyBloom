import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { Input } from "./input";
import { authFormSchema } from "./../../../schema/auth.schema";
import { FormControl, FormField, FormLabel, FormMessage } from "./form";

const formSchema = authFormSchema("sign-up");

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
}

const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
  return (
    <FormField
      key={'custom-input-formfield'}
      control={control}
      name={name}
      render={({ field }) => (
        <div key={'custom-input-render'} className="flex flex-col gap-1.5">
          <FormLabel className="text-[14px] w-full max-w-[280px] font-medium text-gray-700">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="text-[16px] placeholder:text-[16px] rounded-lg border border-gray-300 text-gray-800 placeholder:text-gray-500 bg-gray-25 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent py-3 px-4 w-full"
                type={name === "password" ? "password" : "text"}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-[12px] text-red-500 mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
