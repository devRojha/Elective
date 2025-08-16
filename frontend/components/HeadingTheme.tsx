

export default function HeadingTheme ({first, second, third} : {first :string, second : string, third : string}) {
    return (
        <>
            <span className="text-orange-600">{first}</span><span className="text-white">{second}</span><span className="text-green-800">{third}</span>
        </>
    )
}