package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

public class SeeItemsActivity extends AppCompatActivity {
    String[] mobileArray = {"Android","IPhone","WindowsMobile","Blackberry", "WebOS","Ubuntu","Windows7","Max OS X"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_see_items);

        ArrayAdapter adapter = new ArrayAdapter<String>(this,
                R.layout.activity_list_view, mobileArray);

        ListView listView = (ListView) findViewById(R.id.item_list);
        listView.setAdapter(adapter);
    }

    public void goToMyItems(View v) {
        Intent intent = new Intent(this, MyItems.class);
        startActivity(intent);
    }
}
